import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LogoutIcon from '@mui/icons-material/Logout';
import HistoryIcon from '@mui/icons-material/History';

export function getMenuIcon(menu: string) {
    switch(menu) {
        case "Stock":
            return DashboardIcon;
        case "Product":
            return InventoryIcon;
        case "Bill":
            return ReceiptIcon;
        case "BillHistory":
            return HistoryIcon;
        case "Logout":
            return LogoutIcon;
        default:
            return DashboardIcon;
    }
}