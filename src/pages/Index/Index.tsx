import { Spinner } from "react-bootstrap";
import { useData } from "../../data/loading";
import { useMemo } from "react";
import * as df from "data-forge";
import { processFromRaw } from "../../data/processing";
import { Dashboard } from "../../components/Dashboard/Dashboard";
import { Record } from "../../common/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

export default function Index() {
    const dm = useData();
    const [dataframe, categories] = useMemo(() => {
        const dataframe = processFromRaw(dm.data);
        const categories = dataframe.getSeries<number>("categoryId").distinct().toArray();

        return [dataframe, categories] as [df.IDataFrame<Date, Record>, number[]];
    }, [dm.data?.length]);

    return (
        <div>
            {/* <h2 className="mb-4">Overview</h2> */}
            <p>
                <FontAwesomeIcon icon={faInfoCircle} /> Data are purposely pseudonymized and randomized or randomly sampled from real world. The data are not real and do not represent any real-world data.
            </p>

            {dm.isLoading ? <>
                <Spinner animation="border" role="status" className="d-block mx-auto mt-5">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="text-center mt-3">Downloading data...</p>
            </> : <Dashboard dataframe={dataframe} categories={categories} />}
        </div>
    );
}
