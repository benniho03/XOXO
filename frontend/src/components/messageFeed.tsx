export default function MessageFeed({ messages }: { messages: Message[] }) {
    return messages.map((message, index) => {
        if (message.type === "join") {
            return <div className="text-center" key={index}>
                <span>
                    {message.username} joined
                </span>
            </div>
        }
        if (message.type === "leave") {
            return <div key={index}>{message.username} left</div>
        }
        if (message.type === "message") {
            return <div key={index}>{message.username}: {message.message}</div>
        }
    });
}

