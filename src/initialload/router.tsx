import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ButtonView } from 'src/component/button-view';
import { IState } from './state-interface';
import { commonView } from 'src/pages/common-view';
import { history } from 'src/helper/history';
import Product from 'src/component/product';

function NotFound() {
    return <div className={'m-4'} align={'center'}>
        <h4>Page not found Or you didn't have permission to view the page</h4>
        <ButtonView className={'a-warning'} onClick={() => history.goBack()}>Go Back</ButtonView>
    </div>;
}

function HomeRouterView(props: any) {

    const generateMenuObj = (menu: any) => {
        let path: string = menu.pathTemplate;
        if (!path) {
            path = '/home/' + ((menu.menuName || '').replace(/\s/g, ''));
        }
        return {
            path: path, name: menu.menuName, Component: getComponent(menu.menuName), isExact: true
        };
    };

    const getComponent = (name: string) => {
        switch (name) {
            case 'Product':
                return Product;
            case 'menu2':
                return commonView;
            case 'menu3':
                return commonView;
            default:
                return () => <NotFound></NotFound>;
        }
    };

    let routes: any[] = props.menus;
    routes = routes.map((menu: any, index: number) => {
        let model = generateMenuObj(menu);
        return <Route key={index} exact={!!model.isExact} path={model.path} component={model.Component}></Route>;
    });
    return (<React.Fragment>
        <Switch>
            {routes}
            <Route path='/*' component={NotFound} />
        </Switch>
    </React.Fragment>);
}

function mapStateToProps(state: IState) {
    return {
        menus: state.menuList.menus
    };
}

export const HomeRouter = connect(mapStateToProps)(HomeRouterView);