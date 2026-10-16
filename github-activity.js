const args = process.argv.slice(2);

const userName = args[0];

async function activity(){
    const url = `https://api.github.com/users/${userName}/events`;

    try{
        const response = await fetch(url);
        if(!response.ok){
            if(response.status === 404){
                throw new Error("Username not found.");
            } else if (response.status === 403){
                throw new Error("Rate limited, try again in an hour.");
            } else {
                throw new Error(`Response: ${response.status}`);
            }
        } 

        const result = await response.json();
        
        if (result.length === 0){
            console.log("No recent activity.");
        } else {
            
            for (const event of result){
            switch (event.type){
                case "PushEvent" : 
                console.log(`Pushed to ${event.repo.name}.`);
                break;
                case "PublicEvent":
                console.log(`Made ${event.repo.name} public.`);
                break;
                case "WatchEvent":
                console.log(`Starred ${event.repo.name}.`);
                break;
                case "IssuesEvent": 
                console.log(`${event.payload.action} an issue in ${event.repo.name}.`);
                break;
                default: 
                console.log(`${event.type.replace("Event", "")} in ${event.repo.name}.`);
            }
        } 
    }

    } catch (error) {
        console.error(error.message);
    }
}

if (!userName){
    console.log("No username defined, add your username after you call the name of the file.")
} else {
    activity();
}

