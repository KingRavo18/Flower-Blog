export async function fetch_data(fetch_url, options, response_fail_message) {
    const response = await fetch(fetch_url, options);
    if (!response.ok) {
        throw new Error(response_fail_message);
    }
    const data = await response.json();
    if (data.fatal_fail) {
        window.location.replace("../backend/Session_Maintanance/logout.php");
    }
    if (data.query_fail) {
        throw new Error(data.query_fail);
    }
    return data;
}
//# sourceMappingURL=fetch_data.js.map