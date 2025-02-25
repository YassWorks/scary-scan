export const Output = ({ data, serviceName }) => {
    if (!data) return null;

    if (data.error) {
        return (
            <div style={{ color: "red", fontWeight: "bold" }}>{data.error}</div>
        );
    }

    if (serviceName === "Nmap") {
        const nmapResult = data.nmap_result;
        if (!nmapResult) return <div>No Nmap data available</div>;

        const scanStats = nmapResult.nmap && nmapResult.nmap.scanstats;
        if (!scanStats)
            return <div>No scan statistics available in Nmap results.</div>;

        const scanData = nmapResult.scan;
        if (!scanData)
            return <div>No scan data available in Nmap results.</div>;

        const hostKeys = Object.keys(scanData);
        if (!hostKeys.length)
            return <div>No host data available in Nmap results.</div>;

        const hostKey = hostKeys[0];
        const scanHostData = scanData[hostKey];
        if (!scanHostData)
            return <div>No details available for host {hostKey}.</div>;

        const { hostnames, addresses, status, uptime, tcp, osmatch } =
            scanHostData;

        return (
            <div>
                <div className="output">The Truth You Seek: </div>
                <div className="res">
                    <h2>Nmap Scan Results</h2>

                    <h3 style={{ color: "Green" }}>Scan Summary</h3>
                    <p>
                        <strong>Scan Time:</strong> {scanStats.timestr}
                    </p>
                    <p>
                        <strong>Elapsed Time:</strong> {scanStats.elapsed}{" "}
                        seconds
                    </p>
                    <p>
                        <strong>Hosts Up:</strong> {scanStats.uphosts} of{" "}
                        {scanStats.totalhosts}
                    </p>

                    <h3 style={{ color: "Green" }}>Host Information</h3>
                    <p>
                        <strong>IP Address:</strong>{" "}
                        {addresses ? addresses.ipv4 : "N/A"}
                    </p>
                    <p>
                        <strong>Hostname(s):</strong>{" "}
                        {hostnames && hostnames.length > 0
                            ? hostnames.map((h) => h.name).join(", ")
                            : "None"}
                    </p>
                    <p>
                        <strong>Status:</strong> {status ? status.state : "N/A"}{" "}
                        {status &&
                            status.reason &&
                            `(Reason: ${status.reason})`}
                    </p>
                    <p>
                        <strong>Uptime:</strong>{" "}
                        {uptime
                            ? `${uptime.seconds} seconds (Last Boot: ${uptime.lastboot})`
                            : "N/A"}
                    </p>

                    <h3 style={{ color: "Green" }}>Open Ports &amp; Services</h3>
                    {tcp && Object.keys(tcp).length > 0 ? (
                        Object.keys(tcp).map((port) => {
                            const portData = tcp[port];
                            return (
                                <div key={port}>
                                    <p>
                                        <strong>Port:</strong> {port}
                                    </p>
                                    <p>
                                        <strong>Service:</strong>{" "}
                                        {portData.name || "N/A"}
                                    </p>
                                    <p>
                                        <strong>State:</strong>{" "}
                                        {portData.state || "N/A"}
                                    </p>
                                    {portData.product && (
                                        <p>
                                            <strong>Product:</strong>{" "}
                                            {portData.product}
                                        </p>
                                    )}
                                    {portData.script && (
                                        <div>
                                            <strong>Script Output:</strong>
                                            {Object.keys(portData.script).map(
                                                (scriptName) => (
                                                    <p key={scriptName}>
                                                        <em>{scriptName}:</em>{" "}
                                                        {
                                                            portData.script[
                                                                scriptName
                                                            ]
                                                        }
                                                    </p>
                                                )
                                            )}
                                        </div>
                                    )}
                                    <hr />
                                </div>
                            );
                        })
                    ) : (
                        <p>No open TCP ports found.</p>
                    )}

                    {osmatch && osmatch.length > 0 && (
                        <>
                            <h3 style={{ color: "Green" }}>OS Detection</h3>
                            {osmatch.map((os, index) => (
                                <div
                                    key={index}
                                    style={{ marginBottom: "10px" }}
                                >
                                    <p>
                                        <strong>OS Match:</strong> {os.name}
                                    </p>
                                    <p>
                                        <strong>Accuracy:</strong> {os.accuracy}
                                        %
                                    </p>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        );
    }

    if (serviceName === "Shodan") {
        const { host } = data;
        if (!host) return <div>No data available</div>;

        return (
            <div>
                <div className="output">The Truth You Seek: </div>
                <div className="res">
                    <h2>Shodan Scan Results</h2>

                    <div style={{ marginBottom: "15px" }}>
                        <h2 style={{ color: "Green" }}>General Information</h2>
                        <p>
                            <strong>IP Address:</strong> {host.ip_str}
                        </p>
                        <p>
                            <strong>Hostnames:</strong>{" "}
                            {host.hostnames?.join(", ") || "None"}
                        </p>
                        <p>
                            <strong>Domains:</strong>{" "}
                            {host.domains?.join(", ") || "None"}
                        </p>
                        <p>
                            <strong>ISP:</strong> {host.isp || "Unknown"}
                        </p>
                        <p>
                            <strong>Organization:</strong>{" "}
                            {host.org || "Unknown"}
                        </p>
                        <p>
                            <strong>Location:</strong> {host.location?.city},{" "}
                            {host.location?.country_name}
                        </p>
                    </div>

                    <div>
                        <h2 style={{ color: "Green" }}>
                            Open Ports &amp; Services
                        </h2>
                        {host.data?.length > 0 ? (
                            host.data.map((service, index) => (
                                <div key={index}>
                                    <p>
                                        <strong>Port:</strong> {service.port}
                                    </p>
                                    <p>
                                        <strong>Transport:</strong>{" "}
                                        {service.transport}
                                    </p>
                                    <p>
                                        <strong>Product:</strong>{" "}
                                        {service.product || "Unknown"}
                                    </p>
                                    <p>
                                        <strong>Server:</strong>{" "}
                                        {service.http?.server || "N/A"}
                                    </p>
                                    <p>
                                        <strong>Title:</strong>{" "}
                                        {service.http?.title || "N/A"}
                                    </p>
                                    <p>
                                        <strong>WAF:</strong>{" "}
                                        {service.http?.waf || "None"}
                                    </p>
                                    <p>
                                        <strong>SSL/TLS:</strong>{" "}
                                        {service.ssl?.versions?.join(", ") ||
                                            "N/A"}
                                    </p>
                                    <hr />
                                </div>
                            ))
                        ) : (
                            <p>No open ports found</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
