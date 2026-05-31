import React, { useEffect, useRef, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminFormField, { adminInputClass } from '../../components/admin/AdminFormField';
import { useSiteData } from '../../context/SiteDataContext';
import type { Facility } from '../../types/site';

const emptyFacility = (): Omit<Facility, 'id'> => ({
  name: '',
  description: '',
  image: '',
  hours: '',
});

const AdminFacilitiesPage: React.FC = () => {
  const { facilities, addFacility, updateFacility, deleteFacility } = useSiteData();
  const [editing, setEditing] = useState<Facility | null>(null);
  const [draft, setDraft] = useState<Omit<Facility, 'id'>>(emptyFacility());
  const [isNew, setIsNew] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isNew && !editing) return;
    const timer = window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
    return () => window.clearTimeout(timer);
  }, [isNew, editing]);

  const openNew = () => {
    setDraft(emptyFacility());
    setIsNew(true);
    setEditing(null);
  };

  const openEdit = (f: Facility) => {
    const { id: _id, ...rest } = f;
    setDraft(rest);
    setEditing(f);
    setIsNew(false);
  };

  const closeForm = () => {
    setIsNew(false);
    setEditing(null);
    setDraft(emptyFacility());
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNew) addFacility(draft);
    else if (editing) updateFacility(editing.id, draft);
    setIsNew(false);
    setEditing(null);
    setDraft(emptyFacility());
  };

  return (
    <AdminLayout currentPage="facilities">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facilities</h1>
          <p className="text-gray-600">Amenities and experiences shown on the Facilities page.</p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
        >
          Add facility
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((f) => (
          <div key={f.id} className="bg-white rounded-xl overflow-hidden shadow-md">
            <img src={f.image} alt={f.name} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-bold">{f.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{f.description}</p>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => openEdit(f)}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => window.confirm('Delete?') && deleteFacility(f.id)}
                  className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(isNew || editing) && (
        <form
          ref={formRef}
          onSubmit={handleSave}
          className="scroll-mt-24 bg-white rounded-xl border p-6 mt-10 space-y-4"
        >
          <h2 className="text-lg font-bold">{isNew ? 'New facility' : `Edit: ${editing?.name}`}</h2>
          <AdminFormField label="Facility name">
            <input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={adminInputClass} />
          </AdminFormField>
          <AdminFormField label="Description" hint="What guests can expect from this facility">
            <textarea required value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} rows={3} className={adminInputClass} />
          </AdminFormField>
          <AdminFormField label="Image URL" hint="Cover photo for this facility">
            <input required value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} className={adminInputClass} />
          </AdminFormField>
          <AdminFormField label="Hours / availability" hint="e.g. Daily 7 AM – 10 PM">
            <input required value={draft.hours} onChange={(e) => setDraft({ ...draft, hours: e.target.value })} className={adminInputClass} />
          </AdminFormField>
          <div className="flex gap-3">
            <button type="submit" className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold">
              Save
            </button>
            <button type="button" onClick={closeForm} className="px-6 py-2 border rounded-lg">
              Cancel
            </button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
};

export default AdminFacilitiesPage;
