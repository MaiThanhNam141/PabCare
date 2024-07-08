export default EQ = [
    {
        id:0,
        question: 'Bạn có nắm rõ cảm xúc của bản thân hay không?',
        options:[
            { text: 'Tôi không làm rõ được cảm xúc của bản thân.', type:'EmotionalAwareness',point: 0 },
            { text: 'Hiếm khi tôi nhận thức được cảm xúc của bản thân.', type:'EmotionalAwareness',point: 1 },
            { text: 'Đôi khi tôi không nắm rõ được cảm xúc của bản thân.', type:'EmotionalAwareness',point: 2 },
            { text: 'Tôi nhận thức được cảm xúc của bản thân trong hầu hết hoàn cảnh.', type:'EmotionalAwareness',point: 3 },
            { text: 'Tôi luôn nhận thức được cảm xúc của bản thân trong mọi hoàn cảnh.', type:'EmotionalAwareness',point: 4 },
        ]
    },
    {
        id:1,
        question: 'Cảm xúc có quan trọng đối với bản thân bạn không?',
        options:[
            { text: 'Tôi luôn đặt lý trí lên trên cảm xúc.', type:'EmotionalAwareness',point: 0 },
            { text: 'Tôi không để tâm quá nhiều đến cảm xúc.', type:'EmotionalAwareness',point: 1 },
            { text: 'Đôi khi tôi ưu tiên cho cảm xúc của bản thân.', type:'EmotionalAwareness',point: 2 },
            { text: 'Cảm xúc rất quan trọng và có ảnh hưởng lớn với tôi.', type:'EmotionalAwareness',point: 3 },
            { text: 'Tôi là người sống tình cảm.', type:'EmotionalAwareness',point: 4 },
        ]
    },
    {
        id:2,
        question: 'Tâm trạng của bạn có tác động lên những người xung quanh không?',
        options:[
            { text: 'Không có tác động.', type:'EmotionalAwareness',point: 0 },
            { text: 'Có nhưng không nhiều.', type:'EmotionalAwareness',point: 1 },
            { text: 'Đôi khi có đôi khi không.', type:'EmotionalAwareness',point: 2 },
            { text: 'Cảm xúc của tôi có tác động lớn lên người khác.', type:'EmotionalAwareness',point: 3 },
            { text: 'Mọi người luôn cùng khóc cùng cười với tôi.', type:'EmotionalAwareness',point: 4 },
        ]
    },
    {
        id:3,
        question: 'Bạn có thể thoải mái biểu đạt cảm xúc của mình hay không?',
        options:[
            { text: 'Tôi không làm được.', type:'EmotionalAwareness',point: 0 },
            { text: 'Tôi chỉ có thể biểu đạt với người gần gũi nhất.', type:'EmotionalAwareness',point: 1 },
            { text: 'Có chút ngại.', type:'EmotionalAwareness',point: 2 },
            { text: 'Tôi thường tâm sự với vài người bạn.', type:'EmotionalAwareness',point: 3 },
            { text: 'Tôi cảm thấy điều này hoàn toàn không khó.', type:'EmotionalAwareness',point: 4 },
        ]
    },
    {
        id:4,
        question: 'Tâm trạng của bạn có bị ảnh hưởng bởi nhân tố bên ngoài không?',
        options:[
            { text: 'Cảm xúc của tôi không bị ảnh hưởng.', type:'EmotionalAwareness',point: 0 },
            { text: 'Có một chút.', type:'EmotionalAwareness',point: 1 },
            { text: 'Đôi khi có đôi khi không.', type:'EmotionalAwareness',point: 2 },
            { text: 'Cảm xúc của tôi thường bị ảnh hưởng .', type:'EmotionalAwareness',point: 3 },
            { text: 'Tôi là người đồng cảm.', type:'EmotionalAwareness',point: 4 },
        ]
    },
    {
        id:5,
        question: 'Bạn có biết rõ khi nào mình sắp tức giận hay không?',
        options:[
            { text: 'Không.', type:'EmotionalAwareness',point: 0 },
            { text: 'Tôi hiếm khi nhận thức được.', type:'EmotionalAwareness',point: 1 },
            { text: 'Đôi khi có đôi khi không.', type:'EmotionalAwareness',point: 2 },
            { text: 'Tôi thường nhận thức được.', type:'EmotionalAwareness',point: 3 },
            { text: 'Có.', type:'EmotionalAwareness',point: 4 },
        ]
    },
    {
        id:6,
        question: 'Bạn có thể chia sẻ cảm xúc thật của mình cho người khác hay không?',
        options:[
            { text: 'Không.', type:'EmotionalAwareness',point: 0 },
            { text: 'Tôi chỉ có thể chia sẻ với người gần gũi nhất.', type:'EmotionalAwareness',point: 1 },
            { text: 'Có thể nhưng còn tùy trường hợp.', type:'EmotionalAwareness',point: 2 },
            { text: 'Tôi thường tâm sự cảm xúc thật của bản thân với vài người bạn.', type:'EmotionalAwareness',point: 3 },
            { text: 'Có.', type:'EmotionalAwareness',point: 4 },
        ]
    },
    {
        id:7,
        question: 'Bạn có thể mô tả rõ ràng cảm xúc của bản thân hay không?',
        options:[
            { text: 'Không.', type:'EmotionalAwareness',point: 0 },
            { text: 'Hiếm khi.', type:'EmotionalAwareness',point: 1 },
            { text: 'Đôi khi.', type:'EmotionalAwareness',point: 2 },
            { text: 'Ngoại trừ những cảm xúc quá phức tạp.', type:'EmotionalAwareness',point: 3 },
            { text: 'Có.', type:'EmotionalAwareness',point: 4 },
        ]
    },
    {
        id:8,
        question: 'Khi bị cảm xúc tiêu cực ảnh hưởng, bạn có còn nhận thức rõ được hoàn cảnh xung quanh không?',
        options:[
            { text: 'Không', type:'EmotionalAwareness',point: 0 },
            { text: 'Hiếm khi tôi nhận thức được.', type:'EmotionalAwareness',point: 1 },
            { text: 'Đôi khi.', type:'EmotionalAwareness',point: 2 },
            { text: 'Tôi nhận thức được trong hầu hết hoàn cảnh.', type:'EmotionalAwareness',point: 3 },
            { text: 'Có nhận thức được.', type:'EmotionalAwareness',point: 4 },
        ]
    },
    {
        id:9,
        question: 'Bạn có thể tách mình khỏi những suy nghĩ và cảm xúc cụ thể không ?',
        options:[
            { text: 'Không.', type:'EmotionalAwareness',point: 0 },
            { text: 'Hiếm khi.', type:'EmotionalAwareness',point: 1 },
            { text: 'Đôi khi.', type:'EmotionalAwareness',point: 2 },
            { text: 'Thường thì làm được.', type:'EmotionalAwareness',point: 3 },
            { text: 'Có.', type:'EmotionalAwareness',point: 4 },
        ]
    },
    {
        id:10,
        question: 'Bạn có dám đứng ra chịu trách nhiệm cho hành động của bản thân hay không?',
        options:[
            { text: 'Không.', type:'EmotionalManagement',point: 0 },
            { text: 'Tôi sẽ chỉ đứng ra nếu bị ép.', type:'EmotionalManagement',point: 1 },
            { text: 'Tôi sẽ đứng ra nếu nó không ảnh hưởng lớn đến tôi.', type:'EmotionalManagement',point: 2 },
            { text: 'Tôi sẽ đứng ra trong hầu hết các trường hợp .', type:'EmotionalManagement',point: 3 },
            { text: 'Có.', type:'EmotionalManagement',point: 4 },
        ]
    },
    {
        id:11,
        question: 'Bạn có thể hoàn thành mục tiêu đã đặt ra không?',
        options:[
            { text: 'Không.', type:'EmotionalManagement',point: 0 },
            { text: 'Hiếm khi.', type:'EmotionalManagement',point: 1 },
            { text: 'Đôi khi có.', type:'EmotionalManagement',point: 2 },
            { text: 'Thường là có.', type:'EmotionalManagement',point: 3 },
            { text: 'Tất nhiên là có.', type:'EmotionalManagement',point: 4 },
        ]
    },
    {
        id:12,
        question: 'Bạn có thể tự cân bằng cảm xúc hay không?',
        options:[
            { text: 'Không.', type:'EmotionalManagement',point: 0 },
            { text: 'Có nhưng không nhiều.', type:'EmotionalManagement',point: 1 },
            { text: 'Đôi khi có đôi khi không.', type:'EmotionalManagement',point: 2 },
            { text: 'Thường là có.', type:'EmotionalManagement',point: 3 },
            { text: 'Có.', type:'EmotionalManagement',point: 4 },
        ]
    },
    {
        id:13,
        question: 'Bạn có phải là người kiên nhẫn hay không?',
        options:[
            { text: 'Không.', type:'EmotionalManagement',point: 0 },
            { text: 'Có chút chút.', type:'EmotionalManagement',point: 1 },
            { text: 'Có chút kiên nhẫn nhưng không nhiều.', type:'EmotionalManagement',point: 2 },
            { text: 'Có nhiều nhiều.', type:'EmotionalManagement',point: 3 },
            { text: 'Phải.', type:'EmotionalManagement',point: 4 },
        ]
    },
    {
        id:14,
        question: 'Bạn có chấp nhận lời phê bình từ người khác hay không?',
        options:[
            { text: 'Đánh nhau không?', type:'EmotionalManagement',point: 0 },
            { text: 'Thường thì không.', type:'EmotionalManagement',point: 1 },
            { text: 'Còn phải xem là ai phê bình.', type:'EmotionalManagement',point: 2 },
            { text: 'Tôi sẵn sàng lắng nghe nếu tôi thấy lời phê bình hợp lý.', type:'EmotionalManagement',point: 3 },
            { text: 'Tôi sẵn sàng lắng nghe.', type:'EmotionalManagement',point: 4 },
        ]
    },
    {
        id:15,
        question: 'Bạn có thể giữ bình tĩnh trong những tình huống ngặt nghèo hay không?',
        options:[
            { text: 'Không.', type:'EmotionalManagement',point: 0 },
            { text: 'Tôi hiếm khi giữ bình tĩnh được trong trường hợp đó.', type:'EmotionalManagement',point: 1 },
            { text: 'Đôi khi có đôi khi không.', type:'EmotionalManagement',point: 2 },
            { text: 'Thường là có.', type:'EmotionalManagement',point: 3 },
            { text: 'Có.', type:'EmotionalManagement',point: 4 },
        ]
    },
    {
        id:16,
        question: 'Bạn có mặc kệ những vấn đề miễn là nó không ảnh hưởng trực tiếp đến bạn không?',
        options:[
            { text: 'Không.', type:'EmotionalManagement',point: 0 },
            { text: 'Thường là không.', type:'EmotionalManagement',point: 1 },
            { text: 'Còn tùy trường hợp.', type:'EmotionalManagement',point: 2 },
            { text: 'Thường là có.', type:'EmotionalManagement',point: 3 },
            { text: 'Có.', type:'EmotionalManagement',point: 4 },
        ]
    },
    {
        id:17,
        question: 'Bạn có thể kiềm chế ngay cả khi đang tức giận hay không?',
        options:[
            { text: 'Không.', type:'EmotionalManagement',point: 0 },
            { text: 'Hiếm khi.', type:'EmotionalManagement',point: 1 },
            { text: 'Đôi khi.', type:'EmotionalManagement',point: 2 },
            { text: 'Có thể, trừ một số trường hợp đặc biệt nghiêm trọng.', type:'EmotionalManagement',point: 3 },
            { text: 'Có thể.', type:'EmotionalManagement',point: 4 },
        ]
    },
    {
        id:18,
        question: 'Bạn có thể kiểm soát được những thú vui nếu nó ảnh hưởng tiêu cực đến sức khỏe hay không?',
        options:[
            { text: 'Không', type:'EmotionalManagement',point: 0 },
            { text: 'Đa phần là không.', type:'EmotionalManagement',point: 1 },
            { text: 'Đôi khi.', type:'EmotionalManagement',point: 2 },
            { text: 'Đa phần là được.', type:'EmotionalManagement',point: 3 },
            { text: 'Có.', type:'EmotionalManagement',point: 4 },
        ]
    },
    {
        id:19,
        question: 'Bạn có tập trung tối đa năng lượng cho công việc mang tính sáng tạo hay sở thích không ?',
        options:[
            { text: 'Không', type:'EmotionalManagement',point: 0 },
            { text: 'Đa phần là không.', type:'EmotionalManagement',point: 1 },
            { text: 'Đôi khi.', type:'EmotionalManagement',point: 2 },
            { text: 'Đa phần là có.', type:'EmotionalManagement',point: 3 },
            { text: 'Có.', type:'EmotionalManagement',point: 4 },
        ]
    },
    {
        id:20,
        question: 'Bạn có từng cân nhắc đến hành động của mình sẽ ảnh hưởng đến người khác hay không?',
        options:[
            { text: 'Chưa từng.', type:'SocialEmotionalAwareness',point: 0 },
            { text: 'Hiếm khi cân nhắc.', type:'SocialEmotionalAwareness',point: 1 },
            { text: 'Đôi khi cân nhắc.', type:'SocialEmotionalAwareness',point: 2 },
            { text: 'Cố gắng cân nhắc.', type:'SocialEmotionalAwareness',point: 3 },
            { text: 'Luôn căn nhắc kỹ càng.', type:'SocialEmotionalAwareness',point: 4 },
        ]
    },
    {
        id:21,
        question: 'Bạn có thể cảm nhận được người khác đang trở nên khó chịu không?',
        options:[
            { text: 'Không thể.', type:'SocialEmotionalAwareness',point: 0 },
            { text: 'Rất khó.', type:'SocialEmotionalAwareness',point: 1 },
            { text: 'Đôi khi có đôi khi không.', type:'SocialEmotionalAwareness',point: 2 },
            { text: 'Có thể.', type:'SocialEmotionalAwareness',point: 3 },
            { text: 'Có thể dễ dàng cảm nhận được.', type:'SocialEmotionalAwareness',point: 4 },
        ]
    },
    {
        id:22,
        question: 'Bạn có thể cảm nhận được sự thay đổi trong tâm trạng của những người xung quanh không?',
        options:[
            { text: 'Không.', type:'SocialEmotionalAwareness',point: 0 },
            { text: 'Chỉ có thể nếu sự thay đổi đó rõ ràng.', type:'SocialEmotionalAwareness',point: 1 },
            { text: 'Đôi khi có đôi khi không.', type:'SocialEmotionalAwareness',point: 2 },
            { text: 'Có thể trong nhiều trường hợp.', type:'SocialEmotionalAwareness',point: 3 },
            { text: 'Có thể.', type:'SocialEmotionalAwareness',point: 4 },
        ]
    },
    {
        id:23,
        question: 'Bạn có đủ cam đảm để báo tin xấu đến người khác hay không?',
        options:[
            { text: 'Tôi không làm được.', type:'SocialEmotionalAwareness',point: 0 },
            { text: 'Tôi sẽ lựa chọn trốn tránh nếu có thể.', type:'SocialEmotionalAwareness',point: 1 },
            { text: 'Còn tùy thuộc vào mức độ.', type:'SocialEmotionalAwareness',point: 2 },
            { text: 'Tôi sẽ chọn cách nói giảm nói tránh mà không đi trực tiếp vào vấn đề.', type:'SocialEmotionalAwareness',point: 3 },
            { text: 'Tôi có thể.', type:'SocialEmotionalAwareness',point: 4 },
        ]
    },
    {
        id:24,
        question: 'Bạn có thể thấu hiểu cảm xúc của người khác không?',
        options:[
            { text: 'Tôi không đủ nhạy cảm để làm được điều này.', type:'SocialEmotionalAwareness',point: 0 },
            { text: 'Có một chút.', type:'SocialEmotionalAwareness',point: 1 },
            { text: 'Tôi có thể cảm nhận được ở mức độ nào đó.', type:'SocialEmotionalAwareness',point: 2 },
            { text: 'Tôi cố gắng đặt bản thân vào hoàn cảnh của người khác để thấu hiểu họ nếu có thể.', type:'SocialEmotionalAwareness',point: 3 },
            { text: 'Tôi là người đồng cảm.', type:'SocialEmotionalAwareness',point: 4 },
        ]
    },
    {
        id:25,
        question: 'Bạn bè của bạn có sẵn sàng chia sẻ những bí mật của họ cho bạn không?',
        options:[
            { text: 'Có lẽ là không.', type:'SocialEmotionalAwareness',point: 0 },
            { text: 'Có lẽ bạn tôi còn giấu một số bí mật.', type:'SocialEmotionalAwareness',point: 1 },
            { text: 'Có lẽ là chỉ những bí mật vụn vặt của họ thôi.', type:'SocialEmotionalAwareness',point: 2 },
            { text: 'Bạn tôi chưa từng giấu tôi điều gì.', type:'SocialEmotionalAwareness',point: 3 },
            { text: 'Chúng tôi sống chết có nhau.', type:'SocialEmotionalAwareness',point: 4 },
        ]
    },
    {
        id:26,
        question: 'Bạn có thấy đồng cảm khi chứng kiến người khác gặp phải những điều tồi tệ không?',
        options:[
            { text: 'Không.', type:'SocialEmotionalAwareness',point: 0 },
            { text: 'Tôi không quá để ý đến điều này .', type:'SocialEmotionalAwareness',point: 1 },
            { text: 'Tôi sẽ chỉ bận tâm nếu họ thân thiết với tôi.', type:'SocialEmotionalAwareness',point: 2 },
            { text: 'Tôi sẽ cố gắng giúp đỡ trong phạm vi của bản thân.', type:'SocialEmotionalAwareness',point: 3 },
            { text: 'Có.', type:'SocialEmotionalAwareness',point: 4 },
        ]
    },
    {
        id:27,
        question: 'Bạn có biết rõ bản thân nên nói khi nào và nên im lặng khi nào không?',
        options:[
            { text: 'Tôi không nắm rõ.', type:'SocialEmotionalAwareness',point: 0 },
            { text: 'Tôi nghĩ người xung quanh sẽ không quá để ý đến điều này.', type:'SocialEmotionalAwareness',point: 1 },
            { text: 'Trong một số trường hợp cụ thể thường gặp thì tôi nắm rõ.', type:'SocialEmotionalAwareness',point: 2 },
            { text: 'Tôi tuy không nắm rõ nhưng có thể cảm nhận được từ bầu không khí.', type:'SocialEmotionalAwareness',point: 3 },
            { text: 'Tôi nắm rõ điều này.', type:'SocialEmotionalAwareness',point: 4 },
        ]
    },
    {
        id:28,
        question: 'Bạn có để tâm đến mọi người đã trải qua những chuyện gì không?',
        options:[
            { text: 'Tôi tin rằng thứ quan trọng là hiện tại', type:'SocialEmotionalAwareness',point: 0 },
            { text: 'Nếu họ kể tôi sẽ lắng nghe chứ tôi không chủ động hỏi.', type:'SocialEmotionalAwareness',point: 1 },
            { text: 'Tôi chỉ quan tâm nếu đó là người thân cận với tôi.', type:'SocialEmotionalAwareness',point: 2 },
            { text: 'Tôi muốn biết nhiều thứ về họ hơn nếu họ không phiền.', type:'SocialEmotionalAwareness',point: 3 },
            { text: 'Tôi có để tâm.', type:'SocialEmotionalAwareness',point: 4 },
        ]
    },
    {
        id:29,
        question: 'Bạn có nghĩ rằng EQ quan trọng hơn IQ không ?',
        options:[
            { text: 'Không.', type:'SocialEmotionalAwareness',point: 0 },
            { text: 'Tôi tin rằng IQ sẽ nhỉnh hơn một chút.', type:'SocialEmotionalAwareness',point: 1 },
            { text: 'Còn tùy trường hợp.', type:'SocialEmotionalAwareness',point: 2 },
            { text: 'Tôi tin rằng EQ sẽ nhỉnh hơn một chút.', type:'SocialEmotionalAwareness',point: 3 },
            { text: 'Tôi tin rằng EQ quan trọng hơn.', type:'SocialEmotionalAwareness',point: 4 },
        ]
    },
    {
        id:30,
        question: 'Bạn có thể nhận biết những thay đổi tinh tế trong tâm trạng của một người, chẳng hạn như thay đổi trong giọng nói hoặc ngôn ngữ cơ thể không?',
        options:[
            { text: 'Tôi không làm được.', type:'RelationshipManagement',point: 0 },
            { text: 'Có một chút.', type:'RelationshipManagement',point: 1 },
            { text: 'Đôi khi có đôi khi không.', type:'RelationshipManagement',point: 2 },
            { text: 'Có thể trong hầu hết hoàn cảnh.', type:'RelationshipManagement',point: 3 },
            { text: 'Tôi luôn nhận thức được.', type:'RelationshipManagement',point: 4 },
        ]
    },
    {
        id:31,
        question: 'Bạn có đồng ý với quan điểm gia đình là nơi để chữa lành, để yêu thương không?',
        options:[
            { text: 'Nếu mãi trong tổ ấm thì làm sao đối mặt trực tiếp với mùa đông buốt giá.', type:'RelationshipManagement',point: 0 },
            { text: 'Gia đình cũng là một trong những mối quan hệ xã hội, và nếu là một trong thì ta phải cân bằng giữa nó và các mối quan hệ khác.', type:'RelationshipManagement',point: 1 },
            { text: 'Tôi tin rằng gia đình rất quan trọng trong sự phát triển tinh thần của trẻ nhỏ.', type:'RelationshipManagement',point: 2 },
            { text: 'Tôi đồng ý.', type:'RelationshipManagement',point: 3 },
            { text: 'Gia đình là tất cả với tôi.', type:'RelationshipManagement',point: 4 },
        ]
    },
    {
        id:32,
        question: 'Bạn có khả năng truyền cảm hứng cho mọi người xung quanh không?',
        options:[
            { text: 'Không có tác động.', type:'RelationshipManagement',point: 0 },
            { text: 'Có nhưng không nhiều.', type:'RelationshipManagement',point: 1 },
            { text: 'Đôi khi có đôi khi không.', type:'RelationshipManagement',point: 2 },
            { text: 'Tôi luôn cố gắng mang lại sự tích cực cho người khác.', type:'RelationshipManagement',point: 3 },
            { text: 'Tôi là người truyền cảm hứng.', type:'RelationshipManagement',point: 4 },
        ]
    },
    {
        id:33,
        question: 'Bạn có phải là người vui tính hay không?',
        options:[
            { text: 'Không tôi là người cọc tính.', type:'RelationshipManagement',point: 0 },
            { text: 'Chắc là phải á.', type:'RelationshipManagement',point: 1 },
            { text: 'Khi vui tôi sẽ là người vui tính.', type:'RelationshipManagement',point: 2 },
            { text: 'Tôi luôn là người vui tính với người xung quanh.', type:'RelationshipManagement',point: 3 },
            { text: 'Đúng rồi đấy.', type:'RelationshipManagement',point: 4 },
        ]
    },
    {
        id:34,
        question: 'Kết bạn mới có phải là điều dễ dàng với bạn không?',
        options:[
            { text: 'Không dễ chút nào.', type:'RelationshipManagement',point: 0 },
            { text: 'Có một chút.', type:'RelationshipManagement',point: 1 },
            { text: 'Còn tùy vào tâm trạng lúc đó của tôi.', type:'RelationshipManagement',point: 2 },
            { text: 'Cũng không khó lắm.', type:'RelationshipManagement',point: 3 },
            { text: 'Còn gì khó hơn không?', type:'RelationshipManagement',point: 4 },
        ]
    },
    {
        id:35,
        question: 'Mọi người có đánh giá đúng bạn là người hòa đồng và vui vẻ không?',
        options:[
            { text: 'Không.', type:'RelationshipManagement',point: 0 },
            { text: 'Có một ít người.', type:'RelationshipManagement',point: 1 },
            { text: 'Có một nửa.', type:'RelationshipManagement',point: 2 },
            { text: 'Hầu hết mọi người đều đánh giá tôi như vậy.', type:'RelationshipManagement',point: 3 },
            { text: 'Có đó.', type:'RelationshipManagement',point: 4 },
        ]
    },
    {
        id:36,
        question: 'Bạn có sẵn sàng giúp đỡ người khác hay không?',
        options:[
            { text: 'Tôi không có đủ thời gian để dừng lại giúp đỡ ai cả.', type:'RelationshipManagement',point: 0 },
            { text: 'Tôi tin rằng tính độc lập là rất quan trọng.', type:'RelationshipManagement',point: 1 },
            { text: 'Còn tùy vào ai là người cần giúp đỡ.', type:'RelationshipManagement',point: 2 },
            { text: 'Tôi sẽ giúp đỡ trong khả năng và không ảnh hưởng gì đến tôi.', type:'RelationshipManagement',point: 3 },
            { text: 'Tôi luôn nhiệt tình giúp đỡ người khác ngay cả khi không quen biết gì họ.', type:'RelationshipManagement',point: 4 },
        ]
    },
    {
        id:37,
        question: 'Bạn có thể trở thành chỗ dựa cho người khác hay không?',
        options:[
            { text: 'Không.', type:'RelationshipManagement',point: 0 },
            { text: 'Hiếm khi.', type:'RelationshipManagement',point: 1 },
            { text: 'Đôi khi.', type:'RelationshipManagement',point: 2 },
            { text: 'Nếu vấn đề không quá phức tạp.', type:'RelationshipManagement',point: 3 },
            { text: 'Có.', type:'RelationshipManagement',point: 4 },
        ]
    },
    {
        id:38,
        question: 'Bạn có đủ kiên nhẫn nói chuyện với một người đang vô cùng giận dữ để họ bình tĩnh lại không?',
        options:[
            { text: 'Không', type:'RelationshipManagement',point: 0 },
            { text: 'Nếu điều này thật sự cần thiết.', type:'RelationshipManagement',point: 1 },
            { text: 'Hãy để thời gian giúp họ bình tĩnh.', type:'RelationshipManagement',point: 2 },
            { text: 'Tôi sẽ cố gắng trong phạm vi chịu đựng của mình.', type:'RelationshipManagement',point: 3 },
            { text: 'Có đó.', type:'RelationshipManagement',point: 4 },
        ]
    },
    {
        id:39,
        question: 'Bạn có thể giải quyết các mâu thuẫn và xung đột một cách hiệu quả hay không ?',
        options:[
            { text: 'Càng nói càng đánh nhau to.', type:'RelationshipManagement',point: 0 },
            { text: 'Cách tốt nhất là đừng để tôi mở mồm.', type:'RelationshipManagement',point: 1 },
            { text: 'Tôi sẽ cố gắng nhượng bộ để giải quyết mâu thuẫn.', type:'RelationshipManagement',point: 2 },
            { text: 'Tôi có thể dùng lời nói để tránh xung đột tăng cao.', type:'RelationshipManagement',point: 3 },
            { text: 'Tôi luôn giải quyết các mâu thuẫn một cách triệt để ngay khi nó vừa nhen nhóm xuất hiện.', type:'RelationshipManagement',point: 4 },
        ]
    },
]