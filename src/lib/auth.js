// src/lib/auth.js
import crypto from 'crypto';

// Função para gerar hash de senha
export function hashPassword(password, salt = null) {
  // Gerar um salt se não for fornecido
  const useSalt = salt || crypto.randomBytes(16).toString('hex');
  
  // Criar hash
  const hash = crypto.pbkdf2Sync(password, useSalt, 1000, 64, 'sha512').toString('hex');
  
  // Retorna {hash, salt} para armazenar ambos no banco de dados
  return { hash, salt: useSalt };
}

// Função para verificar senha
export function verifyPassword(password, storedHash, storedSalt) {
  const { hash } = hashPassword(password, storedSalt);
  return hash === storedHash;
}

// Função para gerar senha aleatória
export function generateRandomPassword(length = 8) {
  return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0, length);
}