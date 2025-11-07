import { SupabaseClient } from "@supabase/supabase-js";

const FormService = {
    create: async (request: FormRequest, statuses: Status[], supabase: SupabaseClient) => {
        const requestData: BaseRequest = {
            who: request.who,
            what: request.what,
            when: request.when,
            where: request.where,
            why: request.why,
            how: request.how,
            info: request.info,
            due: request.due,
            priority: request.priority,
            status: statuses.find(s => s.value === 0)?.id || '',
            type: request.type,
            flow: request.flow,
        };

        const { data, error } = await supabase.from('request').insert(requestData).select('id');

        if (error) {
            throw new Error('Failed to create request: ' + error.message);
        }

        const insertedRequests = data as { id: string }[] | null;

        if (!insertedRequests || insertedRequests.length === 0) {
            throw new Error('Failed to create request: missing inserted record');
        }

        const requestId = insertedRequests[0].id;

        // =======================================================================================================

        if (request.venues.length > 0) {
            const venuesToInsert = request.venues.map(v => ({
                request_id: requestId,
                venue_id: v.id,
            }));

            const { error: venueError } = await supabase.from('request_venue').insert(venuesToInsert);

            if (venueError) console.error('Failed to insert venues:', venueError);
        }

        // =======================================================================================================

        if (request.items.length > 0) {
            const requestedItems = request.items.map(r => ({
                request_id: requestId,
                item_id: r.id,
            }));

            console.log(requestedItems);

            const { error: songError } = await supabase.from('request_item').insert(requestedItems);

            if (songError) console.error('Failed to insert request item:', songError);
        }

        // =======================================================================================================

        if (request.songs.length > 0) {
            const requestedSongs = request.songs.map(s => ({
                request_id: requestId,
                song_id: s.id,
            }));

            const { error: songError } = await supabase.from('request_song').insert(requestedSongs);

            if (songError) console.error('Failed to insert songs:', songError);
        }

        return requestId;
    }
}

export default FormService;