import React, { useEffect, useState } from "react";
import "../App.css";

const ProductList = () => {
    const initialData = [
        {
            id: "_id0001",
            label: "Electronics",
            value: 1500,
            group: true,
            totalVariance: 0,
            children: [
                {
                    id: "_idElc_0001",
                    label: "Phones",
                    value: 800,
                },
                {
                    id: "_idElc_0002",
                    label: "Laptops",
                    value: 700,
                },
            ],
        },
        {
            id: "_id0002",
            label: "Furniture",
            value: 1000,
            group: true,
            totalVariance: 0,
            children: [
                {
                    id: "_idFurn_0001",
                    label: "Tables",
                    value: 300,
                },
                {
                    id: "_idFurn_0002",
                    label: "Chairs",
                    value: 700,
                },
            ],
        },
    ];

    const [data, setData] = useState(initialData);
    const [percentages, setPercentages] = useState({});
    const [total, setGrandTotal] = useState(0)

    const handlePercentageChange = (itemId, value) => {
        setPercentages({
            ...percentages,
            [itemId]: value,
        });
    };


    const handleAllocationByPercentage = (itemId) => {
        const percentage = parseInt(percentages[itemId]);

        if (!isNaN(percentage)) {
            const updatedData = data.map((item) => {
                if (item.id === itemId) {
                    const newValue = item.value * (1 + percentage / 100);

                    // Update children based on the proportion of the parent's new value
                    const updatedChildren = item.children.map((child) => {
                        const newChildValue = child.value * (newValue / item.value);
                        return { ...child, value: newChildValue };
                    });

                    return { ...item, value: newValue, children: updatedChildren };
                }

                if (item.children) {
                    const updatedChildren = item.children.map((child) => {
                        if (child.id === itemId) {
                            // Update child value directly based on percentage
                            const newValue = child.value * (1 + percentage / 100);
                            return { ...child, value: newValue };
                        }
                        return child;
                    });
                    return { ...item, children: updatedChildren };
                }
                return item;
            });
            setData(updatedData);
        }
    };

    const handleAllocationValue = (id) => {
        const newValue = parseInt(percentages[id] || 0);
        if (!isNaN(newValue)) {
            setData((prev) => {
                const updatedData = prev.map((item) => {
                    if (item.id === id) {
                        const updatedChildren = item.children.map((child) => {
                            // Update children values based on new parent value
                            const childProportion = child.value / item.value;
                            const newChildValue = newValue * childProportion;
                            return { ...child, value: newChildValue };
                        });
                        return { ...item, value: newValue, children: updatedChildren };
                    }
                    const updatedChildren = item.children.map((child) => {
                        if (child.id === id) {
                            return { ...child, value: newValue };
                        }
                        return child;
                    });
                    return { ...item, children: updatedChildren };
                });
                return updatedData;
            });
        }
    };



    

    useEffect(() => {
        const calculateGrandTotal = (rows) => {
            return rows.reduce((total, row) => {
                return total + (row.group ? calculateGrandTotal(row.children) : row.value);
            }, 0);
        };

        setGrandTotal(calculateGrandTotal(data));
    }, [data]);



    return (
        <div style={{ padding: "20px" }}>
            <table className="table">
                <thead>
                    <tr>
                        <th>Label</th>
                        <th>Value</th>
                        <th>Input</th>
                        <th>Allocation %</th>
                        <th>Allocation Value</th>
                        <th>Variance</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <>
                            <tr key={item.id}>
                                <td>{item.label}</td>
                                <td>{item.value}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={percentages[item.id] || ""}
                                        onChange={(e) =>
                                            handlePercentageChange(item.id, e.target.value)
                                        }
                                    />
                                </td>
                                <td>
                                    <button onClick={() => handleAllocationByPercentage(item.id)}>
                                        Allocation by %
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => handleAllocationValue(item.id)}>
                                        Allocation by Value
                                    </button>
                                </td>
                                <td>{item.totalVariance}%</td>
                            </tr>
                            {item.children &&
                                item.children.map((child) => (
                                    <tr key={child.id}>
                                        <td style={{ paddingLeft: "20px" }}>{child.label}</td>
                                        <td>{child.value}</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={percentages[child.id] || ""}
                                                onChange={(e) =>
                                                    handlePercentageChange(child.id, e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleAllocationByPercentage(child.id)}
                                            >
                                                Allocation by %
                                            </button>
                                        </td>
                                        <td>
                                            <button onClick={() => handleAllocationValue(child.id)}>
                                                Allocation by Value
                                            </button>
                                        </td>
                                        <td>{child.totalVariance}0%</td>
                                    </tr>
                                ))}
                        </>
                    ))}
                    <tr className='grand-total'>
                        <td>Grand Total</td>
                        <td>{total}</td>
                        <td colSpan="4"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;



