import pool from '../db';

export interface Admin {
  id: number;
  username: string;
  password_hash: string;
}

export const findAdminByUsername = async (username: string): Promise<Admin | null> => {
  const [rows] = await pool.query('SELECT * FROM administratori WHERE username = ?', [username]);
  const admins = rows as Admin[];
  return admins.length > 0 ? admins[0] : null;
};
