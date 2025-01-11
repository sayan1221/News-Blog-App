import React, { useEffect,useState } from 'react'

export default function Demo() {
    const [data, setData] = useState("");
    const [search, setSearch] = useState("kolkata");
    useEffect(() => {
        const fetchApi = async ()=>{
            const url = `https://newsapi.org/v2/everything?q=${search}&from=2024-06-18&sortBy=publishedAt&apiKey=17293afbabcb4d92b0d0168aa4b66395`;
            const response = await fetch(url);
            const respJson = await response.json();
            console.log(respJson);
            setData(respJson);
        }
        fetchApi();
    },[search])
    return (
        <>
            {/* <p>{data.articles[1].description}</p> */}
        </>
    )
}
