import React, { Component } from "react";
import { Redirect } from "react-router";
import { BrowserRouter as Router, NavLink, Route } from "react-router-dom";
import { NavDropdown, Navbar, Container, Nav } from "react-bootstrap";
import Navigationbar from "../Navbar/RestaurantNavbarHome";
import MenuView from "./MenuView";
import MenuSections from "./MenuSections";
import MenuItems from "./MenuItems";
import EditMenuSections from './EditMenuSections';
import EditMenuItems from './EditMenuItems';
import "./Menu.css";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.setState({
      activeTab: ""
    });

    this.onTabClick = this.onTabClick.bind(this);
  }

  componentWillMount(){
    document.title = "Your Menu"
  }
  onTabClick = e => {
    this.setState({
      activeTab: e.target.eventKey
    });
  };

  render() {
    let redirectVar = null;

    return (
      <div>
        {redirectVar}
        <div>
        <div> <Navigationbar /></div> 
           <div>
                <Router>
                <Navbar variant="dark" bg="dark" expand="lg" style={{ height: "3rem" }}>
                  <Container fluid>
                    <Navbar.Collapse id="navbar-dark-example">
                      <Nav>
                        <NavDropdown
                          id="nav-dropdown-dark-example"
                          title="Menu"
                          menuVariant="dark"
                          style={{ paddingLeft: "38em" }}> Menu
                          <NavDropdown.Item eventKey="1" as={NavLink} style={{ color: "#000000" }} to="/menu/view">View Menu</NavDropdown.Item>
                          <NavDropdown.Item eventKey="2" as={NavLink} style={{ color: "#000000" }} to="/menu/section">Menu Category</NavDropdown.Item>
                          <NavDropdown.Item eventKey="3" as={NavLink} style={{ color: "#000000" }} to="/menu/item">Add Menu Items</NavDropdown.Item>
                        </NavDropdown>
                      </Nav>
                    </Navbar.Collapse>
                  </Container>
                </Navbar>
                  <Route path="/menu/view" component={MenuView} />
                  <Route path="/menu/section" component={MenuSections} exact/>
                  <Route path="/menu/item" component={MenuItems} exact/>
                  <Route path="/menu/section/update" component={EditMenuSections} />
                  <Route path="/menu/item/update" component={EditMenuItems} />
                </Router>
          </div>
        </div>
      </div>
    );
  }
}

export default Menu;