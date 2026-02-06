import { existsSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';

export class SessionManager {
    private baseDir: string;

    constructor(baseDir: string) {
        this.baseDir = baseDir;
        this.ensureDirectory();
    }

    private ensureDirectory(): void {
        if (!existsSync(this.baseDir)) {
            mkdirSync(this.baseDir, { recursive: true });
        }
    }

    getSessionPath(tenantId: string): string {
        const sessionPath = join(this.baseDir, tenantId);
        if (!existsSync(sessionPath)) {
            mkdirSync(sessionPath, { recursive: true });
        }
        return sessionPath;
    }

    sessionExists(tenantId: string): boolean {
        const sessionPath = join(this.baseDir, tenantId);
        return existsSync(sessionPath);
    }

    deleteSession(tenantId: string): void {
        const sessionPath = join(this.baseDir, tenantId);
        if (existsSync(sessionPath)) {
            rmSync(sessionPath, { recursive: true, force: true });
        }
    }

    listSessions(): string[] {
        if (!existsSync(this.baseDir)) {
            return [];
        }
        const { readdirSync } = require('fs');
        return readdirSync(this.baseDir, { withFileTypes: true })
            .filter((dirent: { isDirectory: () => boolean }) => dirent.isDirectory())
            .map((dirent: { name: string }) => dirent.name);
    }
}
