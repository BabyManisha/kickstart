import React, { Component } from 'react'
import factory from '../ethereum/factory';
import { Card, Button, Message } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';

class CampaignIndex extends Component {
    static async getInitialProps(){
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        return {campaigns}
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: <Link route={`/campaign/${address}`}><a>View Campaign 👀</a></Link>,
                fluid: true
            }
        });

        if(items.length) return <Card.Group items={items} />
        return <Message compact info header="Okie! 🙆🏻‍♀️" content="No Campaigns!! Why don't you create one 👉🏻" />
    }

    render(){
        return (
            <Layout>
                <div id="app">
                    <h2>Open Campaigns⛺️</h2>
                    <Link route="/campaign/new">
                        <a>
                            <Button 
                                content="Create Campaign"
                                icon="add circle"
                                color='blue'
                                floated="right"
                            />
                        </a> 
                    </Link>
                    {this.renderCampaigns()}
                </div>
            </Layout>
        )
    }
}

export default CampaignIndex;
