/** Server-side input validation. Never trust client-side checks alone. */

const USERNAME_RE = /^[a-zA-Z0-9_]{3,24}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateUsername(username: string): string | null {
  if (!username) return "Username is required.";
  if (!USERNAME_RE.test(username)) {
    return "Username must be 3–24 characters: letters, numbers, or underscores.";
  }
  return null;
}

export function validateEmail(email: string): string | null {
  if (!email) return "Email is required.";
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return "Enter a valid email address.";
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (password.length > 200) return "Password is too long.";
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must include both letters and numbers.";
  }
  return null;
}

export function validateDisplayName(name: string): string | null {
  if (!name) return "Display name is required.";
  if (name.length > 40) return "Display name must be 40 characters or fewer.";
  return null;
}

export function validateBio(bio: string): string | null {
  if (bio.length > 500) return "Bio must be 500 characters or fewer.";
  return null;
}

export function validateTitle(title: string): string | null {
  if (!title) return "Title is required.";
  if (title.length < 4) return "Title must be at least 4 characters.";
  if (title.length > 140) return "Title must be 140 characters or fewer.";
  return null;
}

export function validateForumContent(content: string): string | null {
  if (!content) return "Content is required.";
  if (content.length < 2) return "Content is too short.";
  if (content.length > 10_000) return "Content must be 10,000 characters or fewer.";
  return null;
}

export function validateReason(reason: string): string | null {
  if (!reason) return "A reason is required.";
  if (reason.length > 500) return "Reason must be 500 characters or fewer.";
  return null;
}

export function validateSupportName(name: string): string | null {
  if (!name.trim()) return "Name is required.";
  if (name.length > 80) return "Name must be 80 characters or fewer.";
  return null;
}

export function validateSubject(subject: string): string | null {
  if (!subject.trim()) return "Subject is required.";
  if (subject.length > 140) return "Subject must be 140 characters or fewer.";
  return null;
}

export function validateSupportMessage(message: string): string | null {
  if (!message.trim()) return "Message is required.";
  if (message.length < 10) return "Message must be at least 10 characters.";
  if (message.length > 5000) return "Message must be 5,000 characters or fewer.";
  return null;
}
