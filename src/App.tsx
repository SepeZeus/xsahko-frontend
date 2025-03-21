import React, { useState, useEffect } from "react";
import FinGridCalculation from "./components/FinGridCalculation";
import DirectiveCalculation from "./components/DirectiveCalculation";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import "./App.css";
import Header from "./components/Header";
import InfoBox from "./components/InfoBox";
import ButtonGroup from "./components/ButtonGroup";
import Footer from "./components/Footer";

import PriceChart from "./components/PriceGraph";

const App: React.FC = () => {
  const [activeService, setActiveService] = useState<string>("fingrid");

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("electricityPriceFormState");
      localStorage.removeItem("filterFormState");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const renderService = () => {
    switch (activeService) {
      case "fingrid":
        return <FinGridCalculation />;
      case "consumption":
        return <DirectiveCalculation />;
      case "spot":
        return <PriceChart />;
      default:
        return <FinGridCalculation />;
    }
  };

  return (
    <div className="App">
      <Header />
      <Container fluid>
        <div className="content-container">
          <InfoBox />
          <ButtonGroup
            activeService={activeService}
            setActiveService={setActiveService}
          />
          <Row className="justify-content-center">
            <Col md={8}>{renderService()}</Col>
          </Row>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default App;
