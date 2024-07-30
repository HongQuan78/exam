function generateID(): string {
    const min = 100000000; // Minimum 9-digit number
    const max = 999999999; // Maximum 9-digit number
    const id = Math.floor(Math.random() * (max - min + 1) + min).toString();
    return id;
}