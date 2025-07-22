import { useState } from 'react';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { AddCustomerForm } from '../components/AddCustomerForm';
import { useCustomers } from '../hooks/useCustomers';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contacts = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { customers, loading, error } = useCustomers();

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Contacts</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Add Customer</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a new customer</DialogTitle>
                            <DialogDescription>
                                Fill in the details below to add a new customer to your CRM.
                            </DialogDescription>
                        </DialogHeader>
                        <AddCustomerForm onSuccess={() => setIsDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>
            {loading && <p>Loading customers...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className="divide-y bg-white rounded-lg shadow">
                {customers.map((customer) => (
                    <div key={customer.id} className="flex items-center gap-4 py-4 px-6 hover:bg-gray-50">
                        <Link to={`/home/contacts/${customer.id}`} className="hover:text-purple-600">
                            <User className="h-8 w-8" />
                        </Link>
                        <div className="flex-1">
                            <div className="font-semibold">{customer.name}</div>
                            <div className="text-sm text-gray-500">{customer.email}</div>
                        </div>
                        <div className="text-gray-700 font-medium">{customer.company}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Contacts;