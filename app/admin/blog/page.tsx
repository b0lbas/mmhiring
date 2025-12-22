'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type BlogPost = {
  id: number;
  title: string;
  content: string;
  preview: string;
  image: string;
  date: string;
};

type Client = {
  id: number;
  name: string;
  logo: string;
  website?: string;
  active: boolean;
  order: number;
};

export default function AdminBlog() {
  const [activeTab, setActiveTab] = useState<'blog' | 'clients'>('blog');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({ id: null, title: '', content: '', image: '', preview: '' });
  const [previewImage, setPreviewImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Client states
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [editingClient, setEditingClient] = useState(false);
  const [currentClient, setCurrentClient] = useState<Partial<Client>>({ id: null, name: '', logo: '', website: '', order: 0, active: true });
  const [clientPreviewImage, setClientPreviewImage] = useState('');
  const [isUploadingClient, setIsUploadingClient] = useState(false);
  const clientFileInputRef = useRef<HTMLInputElement>(null);
  
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
    fetchClients();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog');
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin/login');
          return;
        }
        throw new Error('Ошибка при получении постов');
      }
      
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      setError('Не удалось загрузить посты');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      setClientsLoading(true);
      const response = await fetch('/api/clients?all=true');
      
      if (!response.ok) {
        throw new Error('Ошибка при получении клиентов');
      }
      
      const data = await response.json();
      setClients(data);
    } catch (error) {
      setError('Не удалось загрузить клиентов');
      console.error(error);
    } finally {
      setClientsLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie = 'admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/admin/login');
  };

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при загрузке изображения');
    }
    
    const data = await response.json();
    return data.fileUrl;
  }

  // Функция для сброса формы
  const resetForm = () => {
    setCurrentPost({ id: null, title: '', content: '', image: '', preview: '' });
    setPreviewImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      console.log('Начинаем загрузку файла:', file.name);
      
      // Показываем предварительный просмотр
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPreviewImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
      
      // Загружаем файл на сервер
      uploadImage(file)
        .then(fileUrl => {
          console.log('Файл успешно загружен, получен URL:', fileUrl);
          setCurrentPost({ ...currentPost, image: fileUrl });
          setIsUploading(false);
        })
        .catch(error => {
          console.error('Ошибка загрузки:', error);
          setError('Не удалось загрузить изображение');
          setIsUploading(false);
        });
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setCurrentPost({ ...currentPost, [e.target.name]: e.target.value });
  }

  const handleEdit = (post: BlogPost) => {
    setEditing(true);
    setCurrentPost(post);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот пост?')) return;
    
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при удалении поста');
      }
      
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      setError('Не удалось удалить пост');
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editing ? `/api/blog/${currentPost.id}` : '/api/blog';
      const method = editing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentPost),
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка при ${editing ? 'обновлении' : 'создании'} поста`);
      }
      
      const savedPost = await response.json();
      
      if (editing) {
        setPosts(posts.map(post => post.id === savedPost.id ? savedPost : post));
      } else {
        setPosts([...posts, savedPost]);
      }
      
      setEditing(false);
      resetForm(); // Используем функцию сброса формы
    } catch (error) {
      setError(`Не удалось ${editing ? 'обновить' : 'создать'} пост`);
      console.error(error);
    }
  };

  // Client functions
  const resetClientForm = () => {
    setCurrentClient({ id: null, name: '', logo: '', website: '', order: 0, active: true });
    setClientPreviewImage('');
    if (clientFileInputRef.current) {
      clientFileInputRef.current.value = '';
    }
  };

  const handleClientImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingClient(true);
      console.log('Начинаем загрузку логотипа:', file.name);
      
      // Показываем предварительный просмотр
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setClientPreviewImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
      
      // Загружаем файл на сервер
      uploadImage(file)
        .then(fileUrl => {
          console.log('Логотип успешно загружен, получен URL:', fileUrl);
          setCurrentClient({ ...currentClient, logo: fileUrl });
          setIsUploadingClient(false);
        })
        .catch(error => {
          console.error('Ошибка загрузки логотипа:', error);
          setError('Не удалось загрузить логотип');
          setIsUploadingClient(false);
        });
    }
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentClient({ ...currentClient, [e.target.name]: e.target.value });
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(true);
    setCurrentClient(client);
    setClientPreviewImage(client.logo);
  };

  const handleDeleteClient = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этого клиента?')) return;
    
    try {
      const response = await fetch(`/api/clients?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при удалении клиента');
      }
      
      setClients(clients.filter(client => client.id !== id));
    } catch (error) {
      setError('Не удалось удалить клиента');
      console.error(error);
    }
  };

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingClient ? `/api/clients/${currentClient.id}` : '/api/clients';
      const method = editingClient ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentClient),
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка при ${editingClient ? 'обновлении' : 'создании'} клиента`);
      }
      
      const savedClient = await response.json();
      
      if (editingClient) {
        setClients(clients.map(client => client.id === savedClient.id ? savedClient : client));
      } else {
        setClients([...clients, savedClient]);
      }
      
      setEditingClient(false);
      resetClientForm();
    } catch (error) {
      setError(`Не удалось ${editingClient ? 'обновить' : 'создать'} клиента`);
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-dark to-primary-blue pt-20 flex justify-center items-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-dark to-primary-blue pt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white font-display">Админ-панель</h1>
          <div className="flex gap-4">
            <Link href="/blog" className="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-glow transition-all duration-300">
              Просмотр блога
            </Link>
            <button
              onClick={handleLogout}
              className="bg-gray-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-glow transition-all duration-300"
            >
              Выйти
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex mb-8 space-x-2">
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === 'blog'
                ? 'bg-gradient-pink text-white shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Управление блогом
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === 'clients'
                ? 'bg-gradient-pink text-white shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Управление клиентами
          </button>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {/* Blog Management Tab */}
        {activeTab === 'blog' && (
          <>
            <form onSubmit={handleSubmit} className="bg-white/10 p-8 rounded-xl mb-8 shadow-glass max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-white">{editing ? 'Редактирование поста' : 'Добавление нового поста'}</h2>
          <input
            type="text"
            name="title"
            placeholder="Заголовок"
            value={currentPost.title}
            onChange={handleChange}
            className="w-full mb-4 p-3 rounded border border-white/20 bg-white/5 text-white focus:outline-none"
            required
          />
          <textarea
            name="preview"
            placeholder="Превью (короткое описание)"
            value={currentPost.preview}
            onChange={handleChange}
            className="w-full mb-4 p-3 rounded border border-white/20 bg-white/5 text-white h-20 focus:outline-none"
          />
          <textarea
            name="content"
            placeholder="Содержание"
            value={currentPost.content}
            onChange={handleChange}
            className="w-full mb-4 p-3 rounded border border-white/20 bg-white/5 text-white h-40 focus:outline-none"
            required
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4 text-white"
          />
          {previewImage && (
            <div className="mb-4">
              <img src={previewImage} alt="Preview" className="max-h-40 rounded-xl mx-auto" />
            </div>
          )}
          <div className="flex space-x-4">
            <button 
              type="submit" 
              className="bg-gradient-pink px-6 py-2 rounded-full text-white font-semibold shadow-lg hover:shadow-glow transition-all duration-300"
            >
              {editing ? 'Обновить' : 'Добавить'}
            </button>
            {editing && (
              <button 
                type="button" 
                onClick={() => { 
                  setEditing(false); 
                  resetForm(); // Используем функцию сброса формы
                }} 
                className="bg-gray-500 px-6 py-2 rounded-full text-white font-semibold"
              >
                Отмена
              </button>
            )}
          </div>
        </form>
        
        <h2 className="text-2xl font-bold text-white mb-6 font-display">Управление постами</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <div key={post.id} className="bg-white/10 p-6 rounded-xl shadow-glass flex flex-col">
              {post.image && (
                <img src={post.image} alt={post.title} className="mb-4 rounded-xl max-h-40 w-full object-cover" />
              )}
              <h3 className="text-xl font-bold text-white mb-2 font-display">{post.title}</h3>
              <p className="text-gray-300 mb-4 flex-grow">{post.preview || post.content.substring(0, 100) + '...'}</p>
              <span className="text-xs text-gray-400 mb-4">{post.date}</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(post)} 
                  className="bg-blue-500 px-4 py-1 rounded-full text-white font-semibold"
                >
                  Редактировать
                </button>
                <button 
                  onClick={() => handleDelete(post.id)} 
                  className="bg-red-500 px-4 py-1 rounded-full text-white font-semibold"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
            </div>
          </>
        )}
        
        {/* Clients Management Tab */}
        {activeTab === 'clients' && (
          <>
            <form onSubmit={handleClientSubmit} className="bg-white/10 p-8 rounded-xl mb-8 shadow-glass max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-white">{editingClient ? 'Редактирование клиента' : 'Добавление нового клиента'}</h2>
              <input
                type="text"
                name="name"
                placeholder="Название компании"
                value={currentClient.name}
                onChange={handleClientChange}
                className="w-full mb-4 p-3 rounded border border-white/20 bg-white/5 text-white focus:outline-none"
                required
              />
              <input
                type="text"
                name="website"
                placeholder="Сайт компании (опционально)"
                value={currentClient.website}
                onChange={handleClientChange}
                className="w-full mb-4 p-3 rounded border border-white/20 bg-white/5 text-white focus:outline-none"
              />
              <input
                type="number"
                name="order"
                placeholder="Порядок отображения (0-100)"
                value={currentClient.order}
                onChange={handleClientChange}
                className="w-full mb-4 p-3 rounded border border-white/20 bg-white/5 text-white focus:outline-none"
                min="0"
                max="100"
              />
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  checked={currentClient.active !== undefined ? currentClient.active : true}
                  onChange={(e) => setCurrentClient({ ...currentClient, active: e.target.checked })}
                  className="mr-2 w-4 h-4"
                />
                <label className="text-white">Активен (отображается на сайте)</label>
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Логотип</label>
                <input
                  ref={clientFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleClientImageChange}
                  className="text-white"
                />
                {isUploadingClient && <p className="text-white mt-2">Загрузка логотипа...</p>}
              </div>
              {clientPreviewImage && (
                <div className="mb-4">
                  <img src={clientPreviewImage} alt="Preview" className="max-h-40 rounded-xl mx-auto bg-white p-2" />
                </div>
              )}
              <div className="flex space-x-4">
                <button 
                  type="submit" 
                  className="bg-gradient-pink px-6 py-2 rounded-full text-white font-semibold shadow-lg hover:shadow-glow transition-all duration-300"
                  disabled={isUploadingClient}
                >
                  {editingClient ? 'Обновить' : 'Добавить'}
                </button>
                {editingClient && (
                  <button 
                    type="button" 
                    onClick={() => { 
                      setEditingClient(false); 
                      resetClientForm();
                    }} 
                    className="bg-gray-500 px-6 py-2 rounded-full text-white font-semibold"
                  >
                    Отмена
                  </button>
                )}
              </div>
            </form>
            
            <h2 className="text-2xl font-bold text-white mb-6 font-display">Управление клиентами</h2>
            
            {clientsLoading ? (
              <div className="text-center text-white">Загрузка клиентов...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {clients.map(client => (
                  <div key={client.id} className="bg-white/10 p-6 rounded-xl shadow-glass flex flex-col">
                    <div className="mb-4 bg-white rounded-xl p-4 flex items-center justify-center h-32">
                      <img src={client.logo} alt={client.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 font-display">{client.name}</h3>
                    {client.website && (
                      <p className="text-gray-300 mb-2 text-sm">
                        <a href={client.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary-pink">
                          {client.website}
                        </a>
                      </p>
                    )}
                    <p className="text-gray-400 text-sm mb-2">Порядок: {client.order}</p>
                    <p className={`text-sm mb-4 ${client.active ? 'text-green-400' : 'text-red-400'}`}>
                      Статус: {client.active ? 'Активен' : 'Неактивен'}
                    </p>
                    <div className="flex gap-2 mt-auto">
                      <button 
                        onClick={() => handleEditClient(client)} 
                        className="bg-blue-500 px-4 py-1 rounded-full text-white font-semibold"
                      >
                        Редактировать
                      </button>
                      <button 
                        onClick={() => handleDeleteClient(client.id)} 
                        className="bg-red-500 px-4 py-1 rounded-full text-white font-semibold"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
