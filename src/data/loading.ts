import { useQuery } from "@tanstack/react-query";

async function downloadData(): Promise<string> {
    const url = `${import.meta.env.VITE_HOST}records.csv`;
    const response = await fetch(url);

    const plain: string = await response.text();

    // Fake loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    return plain;
}

export function useData() {
    const query = useQuery({
        queryKey: ["data"],
        queryFn: () => downloadData(),
    });

    return {
        isLoading: query.isLoading,
        data: query.data,
    }
}
