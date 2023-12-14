import * as bcrypt from 'bcrypt'

export async function hash_password(password : string) {
    const saltOrRounds = 12;
    // salt will be generated with the 12 rounds, increase cost factor
    const hash =  await bcrypt.hash(password, saltOrRounds)
    return (hash)
} 
export function compare_password_hash(raw_password: string, password_hash:string) {
    const match = bcrypt.compareSync(raw_password, password_hash)
    return (match)
}