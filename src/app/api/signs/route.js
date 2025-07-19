import { getTranslations } from "next-intl/server";
import { listSigns } from "../../../utils/signs";

export async function GET(request, {query}) {
    const searchParams = request.nextUrl.searchParams;
    const t = await getTranslations({locale: searchParams.get('locale'), namespace:'Signs'});
    
    try {
        const allSigns = listSigns().map(sign => ({
            id: sign.id,
            name: t(sign.translationKey),
            icon: sign.icon,
        }));;
        return Response.json({ status: 200, data: { 'signs': allSigns} });
    } catch (error) {
        console.error(error)
        return Response.json({ status: 500, error: 'Failed to get signs' });
    }
}