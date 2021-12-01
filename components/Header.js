import React from 'react';
import { Menu, Icon } from 'semantic-ui-react'
import { Link } from '../routes';

const Header = () => {
    return (
        <Menu style={{marginTop: '12px'}}>
            <Link route="/">
                <a className="item">CampCoin ⛺️</a>
            </Link>

            <Menu.Menu position="right">
                <Link route="/">
                    <a className="item">Campaign</a>
                </Link>
                <Link route="/campaign/new">
                    <a className="item">
                        <Icon name="add square" />
                    </a>
                </Link>
            </Menu.Menu>
        </Menu>
    )
}

export default Header;