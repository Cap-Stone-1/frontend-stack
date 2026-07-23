const poll = await Poll.findByPk(req.params.id, {
    attributes: {
        exclude: ["createdAt", "updatedAt"]
    },

    include: {
        model: Option,
        as: "options",
        attributes: ["id", "text"],

        include: {
            model: Vote,
            as: "votes",
            attributes: ["id", "optionId"]
        }
    }
});

const plainPoll = poll.toJSON();

const formattedPoll = {
    ...plainPoll,

    options: plainPoll.options.map((option) => {
        return {
            id: option.id,
            text: option.text,
            voteCount: option.votes.length
        }
    })
}



const obj = {
    id: "",
    title: "",
    description: "",

    options: [
        {
            id: "",
            text: "",
            voteCount: 10
        },

        {

        }
    ]
}
