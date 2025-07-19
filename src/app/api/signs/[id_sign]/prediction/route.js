import { get_a_sign_prediction } from '@/utils/horoscope_agent';
import { getSignFromId } from '../../../../../utils/signs_utils';


export async function GET(request, { params}) {
   
    const { id_sign } = await params;
    const searchParams = request.nextUrl.searchParams;
    console.log(searchParams);
    const locale = searchParams.get('locale');

    if (!id_sign || id_sign.indexOf('undefined') > 0) {
        return Response.json({ status: 400, error: 'Sign id is required' });
    }
    
    const sign = getSignFromId(id_sign);

    if (!sign) {
        return Response.json({ status: 400, error: 'Sign id is invalid!' });
    }

    try {
        const response = await get_a_sign_prediction(sign.translationKey, locale);

        return Response.json({ status: 200, response: response });
    } catch (error) {
        console.error(error)
        return Response.json({ status: 500, error: 'Failed to generate content' });
    }
}