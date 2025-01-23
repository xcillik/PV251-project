import { Button, Form, FormCheck, Spinner } from "react-bootstrap";
import { Category, Period } from "../../common/types";
import { groupArray } from "../../common/utils";
import "./filters.css";
import { useEffect, useState } from "react";

function category(category: Category, key: number, switchCategory: (categoryId: Number) => void, disabled: boolean) {
    return <FormCheck
        disabled={disabled}
        key={key}
        type="switch"
        label={`Category ${category.id}`}
        checked={category.visible}
        id={category.id.toString()}
        onChange={() => switchCategory(category.id)}
    />;
}

function group(group: Category[], key: number, switchCategory: (categoryId: Number) => void, disabled: boolean) {
    return <div key={key} className="dashboard-filters__group">
        {
            group.map((c, key2) => category(c, key2, switchCategory, disabled))
        }
    </div>;
}

type Props = {
    className?: string;
    visibleCategories: Category[];
    setVisibleCategories: (categories: Category[]) => void;
    availablePeriods: Date[];
    setPeriod: (period: Period | null) => void;
    loading: boolean;
};

export function Filters({ className = "", visibleCategories, setVisibleCategories, availablePeriods, setPeriod, loading }: Props) {
    const [visible, setVisible] = useState(false);
    const [year, setYear] = useState<number>(-1);
    const [monthIndex, setMonthIndex] = useState<number>(-1);

    useEffect(() => {
        if (year === -1 || monthIndex === -1)
            return;

        if (!visible) {
            setPeriod(null);
            return;
        }

        setPeriod({
            year: year,
            monthIndex: monthIndex,
        });
    }, [year, monthIndex, visible]);

    const availableYears = [
        ...new Set(
            availablePeriods.map(value => value.getFullYear())
        )
    ].sort((a, b) => b - a);
    const availableMonthsForSelectedYear = year === -1 ? [] : [
        ...new Set(
            availablePeriods.filter(value => value.getFullYear() === year)
            .map(value => value.getMonth())
        )
    ].sort((a, b) => b - a);

    function openPeriodCheck() {
        setVisible(!visible);
        if (year !== -1)
            return;

        setYear(availableYears[0]);
        const temp = [
            ...new Set(
                availablePeriods.filter(value => value.getFullYear() === availableYears[0])
            )
        ]
        setMonthIndex(temp[0].getMonth());
    }

    function switchCategory(categoryId: Number) {
        const newCategories = visibleCategories.map(c => ({
            id: c.id,
            visible: c.id === categoryId ? !c.visible : c.visible,
        }));

        setVisibleCategories(newCategories);
    }

    function selectAllCategs() {
        const newCategories = visibleCategories.map(c => ({
            id: c.id,
            visible: true,
        }));

        setVisibleCategories(newCategories);
    }

    function deselectAllCategs() {
        const newCategories = visibleCategories.map(c => ({
            id: c.id,
            visible: false,
        }));

        setVisibleCategories(newCategories);
    }

    const groups = groupArray(visibleCategories, 5);
    const availableYearsElements = availableYears.map((year, key) => <option key={key} value={`${year}`}>{`${year}`}</option>);
    const availableMonthsElements = availableMonthsForSelectedYear.map((month, key) => <option key={key} value={`${month}`}>{`${new Date(2000, month).toLocaleDateString("default", {month:"long"})}`}</option>);

    const currentPeriodIndex = availablePeriods.findIndex(
        value => value.getFullYear() === year && value.getMonth() === monthIndex
    )

    return <div className={`dashboard-filters ${className}`}>
        {loading && <Spinner animation="border" role="status" variant="secondary"><span className="visually-hidden">Loading...</span></Spinner>}
        <div className="dashboard-filters__period">
            <div className="fs-5 me-3">Period:</div>
            <FormCheck
                type="radio"
                label="All"
                id="all"
                name="period"
                disabled={loading}
                checked={visible === false}
                onChange={() => {setVisible(false)}}
            />
            <FormCheck
                type="radio"
                label="Select month"
                id="month"
                name="period"
                disabled={loading}
                checked={visible === true}
                onChange={() => openPeriodCheck()}
            />
            <div className={visible ? "month-picker visible" : "month-picker"}>
                <Button
                    disabled={loading || currentPeriodIndex - 1 < 0}
                    variant="outline-primary"
                    onClick={() => {
                        setYear(availablePeriods[currentPeriodIndex - 1].getFullYear());
                        setMonthIndex(availablePeriods[currentPeriodIndex - 1].getMonth());
                    }}
                >Previous</Button>
                <Form.Select
                    disabled={loading}
                    value={year}
                    onChange={(e) => {setYear(parseInt(e.target.value.toString())); setMonthIndex(0);}}
                >{availableYearsElements}</Form.Select>
                <Form.Select
                    disabled={loading}
                    value={monthIndex}
                    onChange={(e) => setMonthIndex(parseInt(e.target.value.toString()))}
                >{availableMonthsElements}</Form.Select>
                <Button
                    disabled={loading || currentPeriodIndex + 1 >= availablePeriods.length}
                    variant="outline-primary"
                    onClick={() => {
                        setYear(availablePeriods[currentPeriodIndex + 1].getFullYear());
                        setMonthIndex(availablePeriods[currentPeriodIndex + 1].getMonth());
                    }}
                >Next</Button>
                <Button
                    disabled={loading || currentPeriodIndex === availablePeriods.length - 1}
                    variant="outline-primary"
                    onClick={() => {
                        setYear(availablePeriods[availablePeriods.length - 1].getFullYear());
                        setMonthIndex(availablePeriods[availablePeriods.length - 1].getMonth());
                    }}
                >Current Month</Button>
            </div>
        </div>

        <hr />

        <div className="fs-5 mb-3 d-flex justify-content-between">
            <div>
                Filter Categories:
            </div>
            <div>
                <Button
                    variant="outline-primary"
                    className="me-2"
                    disabled={loading}
                    onClick={() => selectAllCategs()}
                >All</Button>
                <Button
                    variant="outline-primary"
                    disabled={loading}
                    onClick={() => deselectAllCategs()}
                >None</Button>
            </div>
        </div>
        <div className="dashboard-filters__switches">
            {groups.map((g, key) => group(g, key, switchCategory, loading))}
        </div>
    </div>;
}
