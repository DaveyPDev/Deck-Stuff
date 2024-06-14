
export const filterSearch = (data, query) => {
    return data.filter(item => {
        for (let key in query) {
            if (item.hasOwnProperty(key)) {
                switch (key) {
                    case 'legality':
                    case 'set':
                    case 'name':
                    case 'stage':
                    case 'supporters':
                    case 'tool':
                    case 'stadiums':
                    case 'items':
                        if (typeof item[key] === 'string') {
                            if (!item[key].toLowerCase().includes(query[key].toLowerCase())) {
                                return false;
                            }
                        } else if (Array.isArray(item[key])) {
                            if (!item[key].some(val => val.toLowerCase().includes(query[key].toLowerCase()))) {
                                return false;
                            }
                        } else if (item[key] !== query[key]) {
                            return false;
                        }
                        break;
                    default:
                        return false;
                }
            }
        }
        return true;
    });
};