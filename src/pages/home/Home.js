import { Welcome } from "../home/Welcome";
import { ServiceButtons } from "../home/Services";

export const Home = () => {

    const services = [
        {id: 0, name: "Shodan"},
        {id: 1, name: "Nmap"}
    ]

    return (
        <div className="App">
            <Welcome />
            <div style={{ padding: "100px 0" }}>
                <ServiceButtons services={services} />
            </div>
        </div>
    );
};
