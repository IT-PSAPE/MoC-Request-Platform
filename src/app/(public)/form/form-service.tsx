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

        if (request.items.length > 0) {
            const requestedItems = request.items.map(item => ({
                request_id: requestId,
                item_id: item.id,
            }));

            const { error: error } = await supabase.from('request_item').insert(requestedItems);

            if (error) console.error('Failed to insert request item:', error);
        }

        // =======================================================================================================

        if (request.songs.length > 0) {
            const requestedSongs = request.songs.map(song => ({
                request_id: requestId,
                song_id: song.id,
            }));

            const { error: error } = await supabase.from('request_song').insert(requestedSongs);

            if (error) console.error('Failed to insert songs:', error);
        }

        // =======================================================================================================

        if (request.venues.length > 0) {
            const venuesToInsert = request.venues.map(venue => ({
                request_id: requestId,
                venue_id: venue.id,
            }));

            const { error: error } = await supabase.from('request_venue').insert(venuesToInsert);

            if (error) console.error('Failed to insert venues:', error);
        }

        return requestId;
    }
}

export default FormService;