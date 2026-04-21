import { z } from 'zod';

export interface Cursor {
    sort: string;
    id: string;
}

const cursorSortSchema = z.iso.datetime({ offset: true });
const cursorIdSchema = z.uuid();

export const Cursor = {
    new({ last_modified_at, id }: { last_modified_at: string; id: string }): string {
        return Buffer.from(`${last_modified_at}||${id}`).toString('base64');
    },
    from(encoded: string): Cursor | undefined {
        const decoded = Buffer.from(encoded, 'base64').toString('ascii');
        const [cursorSort, cursorId] = decoded.split('||');
        const sortResult = cursorSortSchema.safeParse(cursorSort);
        const idResult = cursorIdSchema.safeParse(cursorId);
        if (sortResult.success && idResult.success) {
            return { sort: sortResult.data, id: idResult.data };
        }
        return undefined;
    }
};
