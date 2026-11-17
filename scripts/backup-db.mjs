import fs from "node:fs/promises";
import path from "node:path";

const sourceFile = path.join(process.cwd(), "prisma", "dev.db");
const backupDir = path.join(process.cwd(), "backups");

async function ensureBackupDir() {
  await fs.mkdir(backupDir, { recursive: true });
}

async function main() {
  await ensureBackupDir();

  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const destination = path.join(backupDir, `travelplan-backup-${timestamp}.db`);
    await fs.copyFile(sourceFile, destination);
    console.log(`Backup created: ${destination}`);
  } catch (error) {
    console.error("Backup failed. Ensure prisma/dev.db exists.");
    console.error(error);
    process.exitCode = 1;
  }
}

main();
