import { useParams } from 'react-router-dom';
import { useCustomer } from '../hooks/useCustomer';
import { AddDealForm } from '../components/AddDealForm';
import { AddNoteForm } from '../components/AddNoteForm';
import { useUpdateDeal } from '../hooks/useUpdateDeal';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { User, Mail, Phone, Building2, Calendar, DollarSign, Target, Brain, MessageSquare, TrendingUp, Lightbulb, StickyNote, Save } from 'lucide-react';
import { useState } from 'react';
import { useAi } from '../hooks/useAi';

const stageOptions = [
  { value: "LEAD", label: "Lead", color: "bg-gray-500" },
  { value: "QUALIFIED", label: "Qualified", color: "bg-blue-500" },
  { value: "PROPOSAL", label: "Proposal", color: "bg-yellow-500" },
  { value: "NEGOTIATION", label: "Negotiation", color: "bg-orange-500" },
  { value: "CLOSED_WON", label: "Closed Won", color: "bg-green-500" },
  { value: "CLOSED_LOST", label: "Closed Lost", color: "bg-red-500" },
];

const Customer = () => {
  const { id } = useParams<{ id: string }>();
  const { customer, loading, error, refreshCustomer } = useCustomer(id!);
  const { updateDeal, loading: updateLoading } = useUpdateDeal();
  const [dealDialogOpen, setDealDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [dealStages, setDealStages] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const { aiLoading } = useAi();
 
  if (loading) return <p>Loading customer...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!customer) return <p>Customer not found.</p>;

  const handleStageChange = (dealId: string, newStage: string) => {
    setDealStages(prev => ({ ...prev, [dealId]: newStage }));
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    try {
      const promises = Object.entries(dealStages).map(([dealId, stage]) => {
        return updateDeal(dealId, { stage });
      });
      
      await Promise.all(promises);
      
      
      refreshCustomer();
      
      
      setDealStages({});
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to update deal stages:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Details</h1>
          <p className="text-gray-600">Manage customer information and deal progress</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Customer Info Card */}
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="h-5 w-5 text-blue-600" /> Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <User className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-semibold text-gray-900">{customer.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Mail className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold text-gray-900">{customer.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Phone className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-semibold text-gray-900">{customer.phone || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Building2 className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Company</p>
                        <p className="font-semibold text-gray-900">{customer.company}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Created {new Date(customer.createdAt).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Deal Details Card */}
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-4 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Target className="h-5 w-5 text-green-600" /> Deal Details
                </CardTitle>
                <div className="flex items-center gap-2">
                  {hasChanges && (
                    <Button 
                      onClick={handleSaveChanges} 
                      disabled={updateLoading}
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      {updateLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  )}
                  <Dialog open={dealDialogOpen} onOpenChange={setDealDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">Add Deal</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add a new deal</DialogTitle>
                      </DialogHeader>
                      <AddDealForm customerId={customer.id} onSuccess={() => {
                        setDealDialogOpen(false);
                        refreshCustomer();
                      }} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {customer.deals.length === 0 ? (
                  <p className="text-gray-500">No deals yet.</p>
                ) : (
                  <div className="space-y-4">
                    {customer.deals.map((deal) => (
                      <div key={deal.id} className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border rounded-lg bg-gray-50">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600">Deal Title</label>
                          <p className="text-lg font-semibold text-gray-900">{deal.title}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600">Amount</label>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <p className="text-lg font-semibold text-gray-900">{deal.amount?.toLocaleString() ?? 'N/A'}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600">Stage</label>
                          <Select
                            value={dealStages[deal.id] || deal.stage}
                            onValueChange={(value) => handleStageChange(deal.id, value)}
                          >
                            <SelectTrigger className="w-full">
                              <div className="flex items-center gap-2">
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {stageOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${option.color}`} />
                                    {option.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Memory Card */}
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Brain className="h-5 w-5 text-purple-600" /> AI Memory
                  {aiLoading && (
                    <div className="ml-2 flex items-center text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                      <span className="ml-2">Analyzing...</span>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-600" />
                        <label className="text-sm font-medium text-gray-600">Preferences</label>
                      </div>
                      {customer.memory?.preferences ? (
                        <p className="text-sm text-gray-800 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                          {customer.memory.preferences}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No preferences recorded</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-red-600" />
                        <label className="text-sm font-medium text-gray-600">Objections</label>
                      </div>
                      {customer.memory?.objections ? (
                        <p className="text-sm text-gray-800 bg-red-50 p-3 rounded-lg border border-red-200">
                          {customer.memory.objections}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No objections recorded</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <label className="text-sm font-medium text-gray-600">Buying Signals</label>
                      </div>
                      {customer.memory?.buyingSignals ? (
                        <p className="text-sm text-gray-800 bg-green-50 p-3 rounded-lg border border-green-200">
                          {customer.memory.buyingSignals}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No buying signals recorded</p>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <label className="text-sm font-medium text-gray-600">Confidence Score</label>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Deal Likelihood</span>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {Math.round((customer.memory?.confidence ?? 0) * 100)}%
                          </Badge>
                        </div>
                        <Progress value={(customer.memory?.confidence ?? 0) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3">
            <div className="sticky top-6">
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 bg-yellow-50 border-yellow-200">
                <CardHeader className="pb-4 flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <StickyNote className="h-5 w-5 text-yellow-600" /> Quick Notes
                  </CardTitle>
                  <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">Add Note</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add a note</DialogTitle>
                      </DialogHeader>
                      <AddNoteForm customerId={customer.id} onSuccess={() => {
                        setNoteDialogOpen(false);
                        refreshCustomer();
                      }} />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {customer.interactions.length === 0 ? (
                    <p className="text-gray-500">No notes yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {customer.interactions.map((note) => (
                        <div key={note.id} className="p-3 bg-yellow-100 rounded-lg border border-yellow-200">
                          <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="h-4 w-4 text-yellow-600" />
                            <span className="text-xs text-gray-500">{new Date(note.createdAt).toLocaleString()}</span>
                          </div>
                          <div className="text-sm text-gray-800 whitespace-pre-line">{note.content}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customer;