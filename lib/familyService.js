import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dataFilePath = path.join(process.cwd(), 'data', 'family-tree.json');

export const familyService = {
    getAllMembers: async () => {
        try {
            if (!fs.existsSync(dataFilePath)) {
                return [];
            }
            const fileContent = fs.readFileSync(dataFilePath, 'utf8');
            return JSON.parse(fileContent);
        } catch (error) {
            console.error('Error reading family tree data:', error);
            return [];
        }
    },

    getMemberById: async (id) => {
        const members = await familyService.getAllMembers();
        return members.find(m => m.id === id) || null;
    },

    createMember: async (data) => {
        const members = await familyService.getAllMembers();
        const newMember = {
            id: uuidv4(),
            ...data,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        members.push(newMember);
        fs.writeFileSync(dataFilePath, JSON.stringify(members, null, 2));
        return newMember;
    },

    updateMember: async (id, data) => {
        const members = await familyService.getAllMembers();
        const index = members.findIndex(m => m.id === id);
        if (index === -1) return null;

        members[index] = {
            ...members[index],
            ...data,
            updatedAt: Date.now()
        };
        fs.writeFileSync(dataFilePath, JSON.stringify(members, null, 2));
        return members[index];
    },

    deleteMember: async (id) => {
        const members = await familyService.getAllMembers();
        // Check if member has children
        const hasChildren = members.some(m => m.parentId === id);
        if (hasChildren) {
            throw new Error('Cannot delete member with children. Delete children first.');
        }

        const filteredMembers = members.filter(m => m.id !== id);
        fs.writeFileSync(dataFilePath, JSON.stringify(filteredMembers, null, 2));
        return true;
    }
};
