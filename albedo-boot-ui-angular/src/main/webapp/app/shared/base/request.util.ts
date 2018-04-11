import { HttpParams } from "@angular/common/http";


export const createRequestParams = (req?: any): HttpParams => {
    let options: HttpParams = new HttpParams();
    if (req) {
        Object.keys(req).forEach((key) => {
            if (key !== 'sort') {
                options = options.set(key, req[key]);
            }
        });
        if (req.sort) {
            req.sort.forEach((val) => {
                options = options.append('sort', val);
            });
        }
    }
    return options;
};

export const createRequestOption = (req?: any): any => {
    return { params: createRequestParams(req), observe: 'body' };
};



