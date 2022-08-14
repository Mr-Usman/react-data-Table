import React from "react";
import "./App.css";
import Filteration from "./Filteration";
import Pagination from "./pagination";

function App() {
  const [policyList, setPolicyList] = React.useState([]);
  const [filteredPolicyList, setFilteredPolicyList] = React.useState([]);
  const [searchName, setSearchName] = React.useState("");
  const [selectedType, setSelectedType] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("");

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
    const { value } = e.target;
    setSelectedType(value);
  };

  const handleStatusChange = (e) => {
    const { value } = e.target;
    setSelectedStatus(value);
  };

  const onResetPolices = () => {
    setFilteredPolicyList(policyList);
    setSearchName("");
    setSelectedType("");
    setSelectedStatus("");
  };

  const filterListByType = () => {
    if (selectedType === "type" || selectedType === "") {
      return policyList;
    }
    const filteredPolicyByType = policyList?.filter((plt) => {
      return plt.insuranceType.toLowerCase() === selectedType;
    });
    return filteredPolicyByType;
  };

  const filterListByStatus = (filterDataByType) => {
    if (selectedStatus === "status" || selectedStatus === "") {
      return filterDataByType;
    }
    const filteredPolicyByStatus = filterDataByType?.filter((plt) => {
      return plt.status.toLowerCase() === selectedStatus;
    });
    return filteredPolicyByStatus;
  };

  React.useEffect(() => {
    getServerData();
  }, []);

  React.useEffect(() => {
    const filterDataByType = filterListByType();
    const filterlstBySta = filterListByStatus(filterDataByType);
    setFilteredPolicyList(filterlstBySta);
  }, [selectedType, selectedStatus]);

  return (
    <div className="w-full p-8">
      <Filteration
        selectedType={selectedType}
        selectedStatus={selectedStatus}
        handleTypeChange={handleTypeChange}
        handleStatusChange={handleStatusChange}
        handleSearch={handleSearch}
        searchName={searchName}
        onResetPolices={onResetPolices}
      />
      <Pagination data={searchResults(filteredPolicyList)} />
    </div>
  );
}

export default App;
