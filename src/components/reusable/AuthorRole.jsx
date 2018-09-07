import React, {Component} from 'react'
import PropTypes from 'prop-types';

const AUTHOR_ROLE = {
    "0": "Others", //Altro personale docente
    "1": "Researcher", //"Ricercatore",
    "2": "Researcher", //"Ricercatore a tempo determinato",
    "3": "Professor", //"Docente di ruolo di Ia fascia",
    "4": "Professor", //"Docente di ruolo di IIa fascia",
    "5": "Professor" //"Professore a tempo determinato"
};

class AuthorRole extends Component {
    render = () => {
        const {role} = this.props;
        
        return (<span>
                {AUTHOR_ROLE[role]}
            </span>);
    }
}

AuthorRole.propTypes = {
    role: PropTypes.number.isRequired
}

export default AuthorRole;