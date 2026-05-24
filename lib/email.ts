import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Pickly <notifications@pickly.app>";

export async function sendJoinRequestReceived(params: {
  hostEmail: string;
  hostName: string;
  playerName: string;
  playerSkill: string;
  gameDate: string;
  gameTime: string;
  courtName: string;
  dashboardUrl: string;
  playerProfileUrl: string;
}) {
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Pickly</h1>
      <h2>New Join Request</h2>
      <p>Hi ${params.hostName},</p>
      <p><strong>${params.playerName}</strong> (${params.playerSkill}) wants to join your game.</p>
      <table style="border-collapse: collapse; width: 100%; margin: 1rem 0;">
        <tr><td style="padding: 0.5rem; border: 1px solid #e5e7eb; font-size: 0.875rem; color: #6b7280;">Game</td>
            <td style="padding: 0.5rem; border: 1px solid #e5e7eb; font-size: 0.875rem;">${params.courtName}</td></tr>
        <tr><td style="padding: 0.5rem; border: 1px solid #e5e7eb; font-size: 0.875rem; color: #6b7280;">Date</td>
            <td style="padding: 0.5rem; border: 1px solid #e5e7eb; font-size: 0.875rem;">${params.gameDate}</td></tr>
        <tr><td style="padding: 0.5rem; border: 1px solid #e5e7eb; font-size: 0.875rem; color: #6b7280;">Time</td>
            <td style="padding: 0.5rem; border: 1px solid #e5e7eb; font-size: 0.875rem;">${params.gameTime}</td></tr>
      </table>
      <a href="${params.dashboardUrl}" style="display: inline-block; padding: 0.625rem 1.25rem; background: #2563eb; color: #fff; text-decoration: none; border-radius: 8px; font-size: 0.875rem;">Review Request</a>
      <p style="margin-top: 1rem; font-size: 0.875rem; color: #6b7280;">
        <a href="${params.playerProfileUrl}">View ${params.playerName}'s profile</a>
      </p>
    </div>
  `;

  return resend.emails.send({ from: FROM, to: params.hostEmail, subject: "New join request for your game", html });
}

export async function sendRequestAccepted(params: {
  playerEmail: string;
  playerName: string;
  hostName: string;
  gameDate: string;
  gameTime: string;
  courtName: string;
  courtAddress: string;
  hostEmail: string;
  roster: string;
  gameUrl: string;
}) {
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Pickly</h1>
      <h2>You're in! Request Accepted</h2>
      <p>Hi ${params.playerName},</p>
      <p>${params.hostName} accepted your request to join their game.</p>
      <table style="border-collapse: collapse; width: 100%; margin: 1rem 0;">
        <tr><td style="padding: 0.5rem; border: 1px solid #e5e7eb; font-size: 0.875rem; color: #6b7280;">Court</td>
            <td style="padding: 0.5rem; border: 1px solid #e5e7eb; font-size: 0.875rem;">${params.courtName}</td></tr>
        <tr><td style="padding: 0.5rem; border: 1px solid #e5e7eb; font-size: 0.875rem; color: #6b7280;">Address</td>
            <td style="padding: 0.5rem; border: 1px solid #e5e7eb; font-size: 0.875rem;">${params.courtAddress}</td></tr>
        <tr><td style="padding: 0.5rem; border: 1px solid #e5e7eb; font-size: 0.875rem; color: #6b7280;">Date</td>
            <td style="padding: 0.5rem; border: 1px solid #e5e7eb; font-size: 0.875rem;">${params.gameDate}</td></tr>
        <tr><td style="padding: 0.5rem; border: 1px solid #e5e7eb; font-size: 0.875rem; color: #6b7280;">Time</td>
            <td style="padding: 0.5rem; border: 1px solid #e5e7eb; font-size: 0.875rem;">${params.gameTime}</td></tr>
      </table>
      <h3 style="font-size: 1rem; margin: 1rem 0 0.5rem;">Confirmed Roster</h3>
      <p style="font-size: 0.875rem; color: #374151;">${params.roster}</p>
      <p style="font-size: 0.875rem; color: #6b7280;">Host: ${params.hostName} (${params.hostEmail})</p>
      <a href="${params.gameUrl}" style="display: inline-block; padding: 0.625rem 1.25rem; background: #2563eb; color: #fff; text-decoration: none; border-radius: 8px; font-size: 0.875rem; margin-top: 0.5rem;">View Game Details</a>
    </div>
  `;

  return resend.emails.send({ from: FROM, to: params.playerEmail, subject: "Your game request was accepted!", html });
}

export async function sendRequestDeclined(params: {
  playerEmail: string;
  playerName: string;
  gameDate: string;
  gameTime: string;
  courtName: string;
  gamesUrl: string;
}) {
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Pickly</h1>
      <h2>Request Declined</h2>
      <p>Hi ${params.playerName},</p>
      <p>Unfortunately, the host declined your request to join the game at <strong>${params.courtName}</strong> on ${params.gameDate} at ${params.gameTime}.</p>
      <p style="color: #6b7280; font-size: 0.875rem;">Don't worry — there are plenty of other games available!</p>
      <a href="${params.gamesUrl}" style="display: inline-block; padding: 0.625rem 1.25rem; background: #2563eb; color: #fff; text-decoration: none; border-radius: 8px; font-size: 0.875rem;">Browse Other Games</a>
    </div>
  `;

  return resend.emails.send({ from: FROM, to: params.playerEmail, subject: "Game request update", html });
}

export async function sendTournamentRegistrationConfirmation(params: {
  playerEmail: string;
  playerName: string;
  tournamentName: string;
  tournamentDate: string;
  tournamentLocation: string;
  organizerName: string;
  organizerEmail: string;
  startTime: string;
  bracketUrl: string;
  tournamentUrl: string;
}) {
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Pickly</h1>
      <h2>Tournament Registration Confirmed</h2>
      <p>Hi ${params.playerName},</p>
      <p>You're registered for <strong>${params.tournamentName}</strong>!</p>
      <table style="border-collapse: collapse; width: 100%; margin: 1rem 0;">
        <tr><td style="padding: 0.5rem; border: 1px solid #e5e7eb; font-size: 0.875rem; color: #6b7280;">Date</td>
            <td style="padding: 0.5rem; border: 1px solid #e5e7eb; font-size: 0.875rem;">${params.tournamentDate}</td></tr>
        <tr><td style="padding: 0.5rem; border: 1px solid #e5e7eb; font-size: 0.875rem; color: #6b7280;">Location</td>
            <td style="padding: 0.5rem; border: 1px solid #e5e7eb; font-size: 0.875rem;">${params.tournamentLocation}</td></tr>
        <tr><td style="padding: 0.5rem; border: 1px solid #e5e7eb; font-size: 0.875rem; color: #6b7280;">Start Time</td>
            <td style="padding: 0.5rem; border: 1px solid #e5e7eb; font-size: 0.875rem;">${params.startTime}</td></tr>
      </table>
      <p style="font-size: 0.875rem; color: #6b7280;">Organizer: ${params.organizerName} (${params.organizerEmail})</p>
      <a href="${params.tournamentUrl}" style="display: inline-block; padding: 0.625rem 1.25rem; background: #2563eb; color: #fff; text-decoration: none; border-radius: 8px; font-size: 0.875rem; margin-top: 0.5rem;">View Tournament</a>
      ${params.bracketUrl ? `<a href="${params.bracketUrl}" style="display: inline-block; padding: 0.625rem 1.25rem; background: #059669; color: #fff; text-decoration: none; border-radius: 8px; font-size: 0.875rem; margin-top: 0.5rem; margin-left: 0.5rem;">View Bracket</a>` : ""}
    </div>
  `;

  return resend.emails.send({ from: FROM, to: params.playerEmail, subject: `Registered for ${params.tournamentName}`, html });
}

export async function sendTournamentResults(params: {
  playerEmail: string;
  playerName: string;
  tournamentName: string;
  winnerName: string;
  resultsUrl: string;
}) {
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Pickly</h1>
      <h2>Tournament Complete!</h2>
      <p>Hi ${params.playerName},</p>
      <p><strong>${params.tournamentName}</strong> has concluded.</p>
      <div style="background: #f3f4f6; padding: 1rem; border-radius: 8px; text-align: center; margin: 1rem 0;">
        <p style="font-size: 0.75rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Champion</p>
        <p style="font-size: 1.5rem; font-weight: 700; color: #059669;">${params.winnerName}</p>
      </div>
      <a href="${params.resultsUrl}" style="display: inline-block; padding: 0.625rem 1.25rem; background: #2563eb; color: #fff; text-decoration: none; border-radius: 8px; font-size: 0.875rem;">View Full Results</a>
      <p style="margin-top: 1rem; font-size: 0.875rem; color: #6b7280;">Thanks for playing. See you at the next tournament!</p>
    </div>
  `;

  return resend.emails.send({ from: FROM, to: params.playerEmail, subject: `${params.tournamentName} — Results`, html });
}
