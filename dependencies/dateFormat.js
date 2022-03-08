import { DateTime } from "luxon"

// todo: return simploiufied date and other with hour

const parseDate = (date_string) => {
    return DateTime.fromISO(date_string).toLocaleString(DateTime.DATE_MED)
};

export default parseDate