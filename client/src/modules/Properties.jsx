import { h } from 'preact';

const Properties = () => {
    return (
        <div className="grid grid-cols-3 gap-4 p-4">
            {[
                { name: "slots", type: "number" },
                { name: "gamemode", type: "select", options: ["Survival", "Creative", "Adventure", "Spectator"] },
                { name: "difficulty", type: "select", options: ["Peaceful", "Easy", "Normal", "Hard"] },
                { name: "whitelist", type: "checkbox" },
                { name: "cracked", type: "checkbox" },
                { name: "pvp", type: "checkbox" },
                { name: "commandblocks", type: "checkbox" },
                { name: "fly", type: "checkbox" },
                { name: "animals", type: "checkbox" },
                { name: "monster", type: "checkbox" },
                { name: "villagers", type: "checkbox" },
                { name: "nether", type: "checkbox" },
                { name: "force gamemode", type: "checkbox" },
                { name: "spawn protection", type: "number" },
            ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-600 rounded">
                    <span>{item.name}</span>
                    {item.type === "checkbox" ? (
                        <input type="checkbox" className="toggle" />
                    ) : item.type === "number" ? (
                        <input type="number" className="p-2 rounded bg-gray-800 text-white border border-gray-500 w-16 text-center" />
                    ) : (
                        <select className="p-2 rounded bg-gray-800 text-white border border-gray-500">
                            {item.options.map((option, i) => (
                                <option key={i} value={option}>{option}</option>
                            ))}
                        </select>
                    )}
                </div>
            ))}

            {/* گزینه مخصوص "resource pack required" با Textbox */}
            <div className="flex items-center justify-between p-4 bg-gray-600 rounded col-span-3">
                <span>resource pack required</span>
                <input type="text" placeholder="Enter resource pack URL"
                       className="p-2 rounded bg-gray-800 text-white border border-gray-500 w-64"/>
            </div>
        </div>
    );
}

export default Properties;
