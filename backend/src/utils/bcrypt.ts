import bcrypt from 'bcryptjs';

export const hashValue = async (value: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(value, saltRounds);
}

export const compareValues = async (value: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(value, hash);
}