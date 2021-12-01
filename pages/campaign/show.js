import React, { Component } from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import { Button, Card, Grid } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

export default class CampaignShow extends Component {
    static async getInitialProps(props) {
        const campaign = await Campaign(props.query.address)

        const summary = await campaign.methods.getSummary().call();

        return {
            address: props.query.address,
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        }
    }

    renderCards(){
        const { 
            balance, 
            manager, 
            minimumContribution,
            requestsCount,
            approversCount
        } = this.props;

        const items = [
            {
                header: manager,
                description: 'The Manager created this campaign and can create requests',
                meta: 'Address of Manager',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minimumContribution,
                description: 'You must contribute at least this much "Wei" to become an approver',
                meta: 'Minimum Contribution (Wei!)',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                description: 'Current Balance of Campaign',
                meta: 'Campaign Balance (Ether!)',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: requestsCount,
                description: 'Number of requests that have created in the Campaign',
                meta: 'Number of Requests',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: approversCount,
                description: 'Number of Approvers',
                meta: 'Number of people who have already donated to the Campaign',
                style: { overflowWrap: 'break-word' }
            }
        ]
        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout>
                <h1>Campaign Information</h1>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaign/${this.props.address}/requests`}>
                                <a>
                                    <Button style={{marginTop: '12px'}} color="blue">View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        )
    }
}
