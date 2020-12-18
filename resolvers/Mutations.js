const Mutations = {
    async makeMessage (_, {user, content}, {initialArr, subscribers}) {
        const id = initialArr.length;
        initialArr.push({id, user, content});
        subscribers.forEach(fn => fn());
        return initialArr;
    }
}

module.exports = Mutations;