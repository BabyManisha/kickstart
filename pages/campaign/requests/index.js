import React, { Component, useState } from 'react';
import Layout from '../../../components/Layout';
import { Link, Router } from '../../../routes';
import { Button, Table, Message, Loader } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';

export default class RequestIndex extends Component {
    state = {
        loading: false,
        errorMessage: ''
    }

    static async getInitialProps(props){
        const { address } = props.query;

        const campaign = await Campaign(address);

        const totalRequests = await campaign.methods.getRequestsCount().call();

        const approversCount = await campaign.methods.approversCount().call();

        const requests = await Promise.all(
            Array(parseInt(totalRequests)).fill().map((e, i) => {
                return campaign.methods.requests(i).call();
            })
        )
        console.log(requests);
        
        return { address, totalRequests, requests, approversCount };
    }

    sendAction = async([index, type]) => {
        const campaign = await Campaign(this.props.address);
        const accounts = await web3.eth.getAccounts();
        this.setState({loading: true, errorMessage: ''});
        try{
            if(type == 'approve'){
                await campaign.methods.approveRequest(index).send({
                    from: accounts[0]
                });
            }else if(type == 'finalize'){
                await campaign.methods.finalizeRequest(index).send({
                    from: accounts[0]
                });
            }
            this.setState({loading: false, errorMessage: ''});
            Router.replaceRoute(`/campaign/${this.props.address}/requests`);
        } catch(error){
            this.setState({
                loading: false,
                errorMessage: error.message
            });
            this.setState({loading: false, errorMessage: error.message});
        }
    }

    render() {
        const { Header, Row, HeaderCell, Body, Cell } = Table;
        const headers = ['ID', 'Description', 'Amount (Ether!)', 'Recipient', 'Approval Count', 'Approve', 'Finalize'];
        return (
            <Layout>
                <h1>Request List</h1>
                <Link route={`/campaign/${this.props.address}/requests/new`}>
                    <a>
                        <Button color="blue" floated="right" style={{marginBottom: '12px'}}>Add New Request</Button>
                    </a>
                </Link>

                <Table>
                    <Header>
                        <Row>
                            { headers.map((h, i) => <HeaderCell key={i}>{h}</HeaderCell>) }
                        </Row>
                    </Header>
                    <Body>
                        { this.props.requests.map((r, i) => {
                                return (
                                    <Row key={i}>
                                        <Cell>{i}</Cell>
                                        <Cell>{r['description']}</Cell>
                                        <Cell>{web3.utils.fromWei(r['value'], 'ether')}</Cell>
                                        <Cell>{r['recipient']}</Cell>
                                        <Cell>{r['approvalCount']} / {this.props.approversCount}</Cell>
                                        <Cell>
                                            {
                                                r['complete'] ? null : <Button basic onClick={this.sendAction.bind(this, [i, 'approve'])} color="blue">Approve</Button>
                                            }
                                        </Cell>
                                        <Cell>
                                            {
                                                r['complete'] ? 'Completed' 
                                                : <Button disabled={!(r['approvalCount'] > this.props.approversCount / 2)} basic onClick={this.sendAction.bind(this, [i, 'finalize'])} color="green">Finalize</Button>
                                            }
                                        </Cell>
                                    </Row>
                                )
                            })
                        }
                    </Body>
                </Table>

                <div>Found {this.props.totalRequests} Requests!</div>
                
                { this.state.loading ? 
                    <Loader active inline='centered'>Processing!!</Loader>
                    : ''
                }
                { this.state.errorMessage ? 
                    <Message error header="Oops! 🙊" content={this.state.errorMessage} />
                    : ''
                }

            </Layout>
        )
    }
}
