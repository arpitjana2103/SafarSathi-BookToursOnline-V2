class APIFeatures {
    constructor(query, reqQuery) {
        this.query = query;
        this.reqQuery = reqQuery;
    }

    filter() {
        const filterObj = APIFeatures.processReqQuery(this.reqQuery);
        this.query = this.query.find(filterObj);
        return this;
    }

    sort() {
        const sortedBy = APIFeatures.processSortedBy(this.reqQuery.sort);
        this.query = this.query.sort(sortedBy);
        return this;
    }

    limitFields() {
        const fields = APIFeatures.processFields(this.reqQuery.fields);
        this.query = this.query.select(fields);
        return this;
    }

    paginate() {
        const page = Number(this.reqQuery.page) || 1;
        const limit = Number(this.reqQuery.limit) || 50;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }

    static processReqQuery({ ...reqQuery }) {
        // 1. Exclude prohibited fields
        const excludeFields = ["page", "limit", "sort", "fields"];
        excludeFields.forEach((field) => delete reqQuery[field]);

        // 2. Add '$' into comparison operators
        let queryStr = JSON.stringify(reqQuery);
        const operators = ["gt", "gte", "lt", "lte"];
        operators.forEach(function (operator) {
            const regex = new RegExp(`(${operator})\\b`, "g");
            queryStr = queryStr.replace(regex, `$${operator}`);
        });
        reqQuery = JSON.parse(queryStr);

        return reqQuery;
    }

    static processSortedBy(sortedByStr) {
        if (!sortedByStr) return "-createdAt";
        return sortedByStr.replace(/,/g, " ");
    }

    static processFields(fieldsStr) {
        if (!fieldsStr) return "-__v";
        return fieldsStr.replace(/,/g, " ");
    }
}

module.exports = APIFeatures;
