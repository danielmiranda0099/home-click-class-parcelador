function shuffleString(str) {
  return str
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
}

export function generatePassword(length = 12) {
  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialCharacters = "!@#$%&*()_+-=?";

  // Combine all possible characters and shuffle them
  let allCharacters = upperCase + lowerCase + numbers + specialCharacters;
  allCharacters = shuffleString(allCharacters);

  let password = "";

  // Ensure at least one character of each type is included
  password += upperCase[Math.floor(Math.random() * upperCase.length)];
  password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password +=
    specialCharacters[Math.floor(Math.random() * specialCharacters.length)];

  // Fill the rest of the password with random characters until reaching the desired length
  for (let i = password.length; i < length; i++) {
    password += allCharacters[Math.floor(Math.random() * allCharacters.length)];
  }

  // Shuffle the password so that initial characters aren't in a predictable order
  password = shuffleString(password);

  return password;
}
