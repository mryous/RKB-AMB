import fs from 'fs';
import path from 'path';

const settingsFilePath = path.join(process.cwd(), 'data', 'site-settings.json');

export const settingsService = {
    getSettings: async () => {
        try {
            if (!fs.existsSync(settingsFilePath)) {
                return null;
            }
            const fileContent = fs.readFileSync(settingsFilePath, 'utf8');
            return JSON.parse(fileContent);
        } catch (error) {
            console.error('Error reading settings:', error);
            return null;
        }
    },

    saveSettings: async (newSettings) => {
        try {
            // Get existing settings to merge with
            let currentSettings = {};
            if (fs.existsSync(settingsFilePath)) {
                const fileContent = fs.readFileSync(settingsFilePath, 'utf8');
                currentSettings = JSON.parse(fileContent);
            }

            const updatedSettings = {
                ...currentSettings,
                ...newSettings,
                updatedAt: Date.now()
            };

            fs.writeFileSync(settingsFilePath, JSON.stringify(updatedSettings, null, 4));
            return updatedSettings;
        } catch (error) {
            console.error('Error saving settings:', error);
            throw error;
        }
    }
};
