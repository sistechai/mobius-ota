const { createApp } = Vue

createApp({
  data() {
    return {
      checkForm: {
        aeid: ''
      },
      form: {
        file: null,
        password: null
      },
      isCheckLoading: false,
      isUploadLoading: false,
      toast: {
        type: '',
        show: false,
        title: '',
        content: ''
      },
      result: null
    }
  },
  mounted() {
  },
  methods: {
    initToast(content, title, type, delay=3000) {
      this.toast.content = content
      this.toast.title = title
      this.toast.type = type
      this.toast.show = true
      setTimeout(() => {
        this.toast.show = false
      }, delay)
    },
    onInitAxios() {
      axios.defaults.baseURL = 'http://localhost:7580/';
      //axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
      axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    },
    async onCheckVersion() {
      this.result = null
      this.isCheckLoading = true
      await axios.post('/fw/check', this.checkForm).then((res) => {
        this.result = res.data
        this.isCheckLoading = false
      })
      .catch((err) => {
        this.isCheckLoading = false
        this.initToast(err.response.data, 'Error', 'text-danger')
      })
    },
    onUploadVersion() {
      this.isUploadLoading = true
      const formData = new FormData()
      formData.append('file', this.form.file)
      const headers = {
        'Authorization': `XPass ${this.form.password}`,
        'Content-Type': 'multipart/form-data'
      }
      axios.post('/fw/upload', formData , { headers }).then((res) => {
        this.isUploadLoading = false
        this.initToast(res.data.message, 'Info', 'text-primary')
      })
      .catch((err) => {
        this.isUploadLoading = false
        this.initToast(err.response.data, 'Error', 'text-danger')
      })
    },
    handleFileUpload() {
      this.form.file = this.$refs.file.files[0]
    }
  },
}).mount('#app')
