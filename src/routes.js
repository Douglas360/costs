
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';
import { Company } from './components/Pages/Company';
import { Contact } from './components/Pages/Contact';
import { Home } from './components/Pages/Home';
import { NewProject } from './components/Pages/NewProject';
import { Footer } from './components/layout/Footer';
import { Container } from './components/layout/Container';
import { Navbar } from './components/layout/Navbar';
import { Projects } from './components/Pages/Projects';

export const AppRouter = () => {

    return (
        <>
            <Router>
                <Navbar />
                <Container customClass="min-height">
                    <Routes>
                        <Route
                            path="/"
                            exact
                            element={
                                <Home />
                            }
                        />
                        <Route
                            path="/company"
                            element={
                                <Company />
                            }
                        />
                        <Route
                            path="/contact"
                            element={
                                <Contact />
                            }
                        />
                        <Route
                            path="/newproject"
                            element={
                                <NewProject />
                            }
                        />
                        <Route
                            path="/project"
                            element={
                                <Projects />
                            }
                        />

                    </Routes>
                </Container>
                <Footer />
            </Router>


        </>
    );
};
