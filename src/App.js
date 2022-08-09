import React from "react";
import "./App.css";
import Filteration from "./Filteration";
import Pagination from "./pagination";

function App() {
  const [policyList, setPolicyList] = React.useState([]);
  const [filteredPolicyList, setFilteredPolicyList] = React.useState([]);
  const [searchName, setSearchName] = React.useState("");

  const getServerData = () => {
    fetch("https://feather-backend.herokuapp.com/policies")
      .then((res) => res.json())
      .then((data) => {
        const { data: policyListArray } = data;
        const activeAndPendingPolicies = policyListArray
          .map((policy) => {
            const { status } = policy;
            if (status === "ACTIVE" || status === "PENDING") {
              return { ...policy };
            }
          })
          .filter((item) => item);
        setPolicyList(activeAndPendingPolicies || []);
        setFilteredPolicyList(activeAndPendingPolicies || []);
      });
  };

  const handleSearch = (e) => {
    setSearchName(e.target.value);
  };

  const searchResults = (data) => {
    return data.filter((item, key) => {
      const {
        customer: { firstName, lastName },
      } = item;
      const fullName = `${firstName} ${lastName}`;
      return fullName.toLowerCase().indexOf(searchName.toLowerCase()) > -1;
    });
  };

  const handleTypeChange = (e) => {
    console.log(
      "🚀 ~ file: App.js ~ line 44 ~ handleTypeChange ~ e",
      e.target.value
    );
    const { value } = e.target;
    if (value === "type") {
      setFilteredPolicyList(policyList);
    } else {
      const filteredPolicyByType = policyList?.filter(
        ({ insuranceType }, index) => insuranceType.toLowerCase() === value
      );
      // setPolicyList(filteredPolicyByType);
      setFilteredPolicyList(filteredPolicyByType);
    }
  };

  // const handleStatusChange = (e) => {
  //   const { value } = e.target;
  //   if (value === "status") {
  //     setFilteredPolicyList(policyList);
  //   } else {
  //     const filteredPolicyByType = filteredPolicyList?.filter(
  //       ({ status }, index) => status.toLowerCase() === value
  //     );
  //     // setPolicyList(filteredPolicyByType);
  //     setFilteredPolicyList(filteredPolicyByType);
  //   }
  // };

  const onResetPolices = () => {
    setFilteredPolicyList(policyList);
  };

  React.useEffect(() => {
    getServerData();
  }, []);

  console.log(
    "🚀 ~ file: App.js ~ line 46 ~ searchResults ~ policyList",
    policyList
  );

  return (
    <div className="w-full p-8">
      <Filteration
        handleTypeChange={handleTypeChange}
        // handleStatusChange={handleStatusChange}
        handleSearch={handleSearch}
        searchName={searchName}
        onResetPolices={onResetPolices}
      />
      <Pagination data={searchResults(filteredPolicyList)} />
    </div>
  );
}

export default App;
