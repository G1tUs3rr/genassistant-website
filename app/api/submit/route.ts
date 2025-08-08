import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';
import { Resend } from 'resend';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  let client;
  try {
    const data = await request.json();

    const {
      name,
      email,
      role,
      emailProvider,
      teamSize,
      emailVolume,
      issues,
      otherChallenge,
    } = data

    // Validate required fields
    if (!name || !email || !emailProvider || !teamSize || !emailVolume || !issues || issues.length === 0) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // If 'other' is a pain point, the otherChallenge text must be present
    if (issues.includes("other") && !otherChallenge) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const query = `
      INSERT INTO submissions (name, email, role, email_provider, team_size, email_volume, pain_points, other_challenge)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id;
    `
    const values = [name, email, role, emailProvider, teamSize, emailVolume, issues, otherChallenge]

    client = await pool.connect();
    const result = await client.query(query, values);

    console.log('Successfully inserted submission with ID:', result.rows[0].id);

    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: process.env.EMAIL_RECIPIENT!,
        subject: 'New Form Submission',
        html: `<p>New form submission:</p>
               <p>Name: ${name}</p>
               <p>Email: ${email}</p>
               <p>Role: ${role}</p>
               <p>Email Provider: ${emailProvider}</p>
               <p>Team Size: ${teamSize}</p>
               <p>Email Volume: ${emailVolume}</p>
               <p>Issues: ${issues.join(', ')}</p>
               <p>Other Challenge: ${otherChallenge || 'N/A'}</p>`,
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Don't block the response, just log the error
    }

    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
  } finally {
    if (client) {
      client.release();
    }
  }
}